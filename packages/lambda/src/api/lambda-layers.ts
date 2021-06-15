import {
	LambdaClient,
	LayersListItem,
	ListLayersCommand,
	PublishLayerVersionCommand,
} from '@aws-sdk/client-lambda';

const runtimes: string[] = ['nodejs14.x', 'nodejs12.x', 'nodejs10.x'];

const LAYER_NAME = 'remotion-binaries';

const createLayer = ({
	lambdaClient,
	name,
	key,
	sourceS3Bucket,
}: {
	lambdaClient: LambdaClient;
	name: string;
	key: string;
	sourceS3Bucket: string;
}) => {
	return lambdaClient.send(
		new PublishLayerVersionCommand({
			Content: {
				S3Bucket: sourceS3Bucket,
				S3Key: key,
			},
			LayerName: name,
			LicenseInfo:
				'https://ffmpeg.org/legal.html / https://chromium.googlesource.com/chromium/src/+/refs/heads/main/LICENSE',
			CompatibleRuntimes: runtimes,
			Description: 'FFMPEG and Chromium binaries for Lambda',
		})
	);
};

const getLayers = async (lambdaClient: LambdaClient) => {
	const data = await lambdaClient.send(
		new ListLayersCommand({
			CompatibleRuntime: runtimes[0],
		})
	);
	return (data.Layers || []) as LayersListItem[];
};

const hasLayer = (name: string, layers: LayersListItem[]) => {
	return layers.find((l) => l.LayerName === name);
};

const ensureLayer = async (
	layers: LayersListItem[],
	lambdaClient: LambdaClient
): Promise<string> => {
	const existingLayer = hasLayer(LAYER_NAME, layers);
	if (existingLayer) {
		return existingLayer.LatestMatchingVersion?.LayerVersionArn as string;
	}

	const layer = await createLayer({
		lambdaClient,
		name: LAYER_NAME,
		key: 'remotion.zip',
		sourceS3Bucket: 'remotion-binaries',
	});
	return layer.LayerVersionArn as string;
};

export const ensureLayers = async (lambdaClient: LambdaClient) => {
	const layers = await getLayers(lambdaClient);
	const layerArn = await ensureLayer(layers, lambdaClient);

	return {layerArn};
};