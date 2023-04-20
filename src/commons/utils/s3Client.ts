/* eslint-disable @typescript-eslint/no-inferrable-types */
import { DeleteObjectCommand, DeleteObjectsCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { AWSConfig } from "src/configs/aws.cnf";

const s3 = new S3Client({
    region: AWSConfig.config.REGION,
    credentials: {
        accessKeyId: AWSConfig.config.AWS3_KEY_ID,
        secretAccessKey: AWSConfig.config.AWS3_ACCESS_KEY,
    },
})

const uploadFile = async (option: { file: Express.Multer.File, filePath: string, mimetype?: string }) => {
    return await s3.send(new PutObjectCommand({
        Bucket: AWSConfig.config.BUCKET_NAME,
        Key: option.filePath,
        Body: option.file.buffer,
        CacheControl: 'max-age=31536000',
        ContentType: option.mimetype
    }));
}

const signedUrl = async (key: string, expireIn: number = 600) => {
    const command = new GetObjectCommand({
        Bucket: AWSConfig.config.BUCKET_NAME,
        Key: key
    });
    return await getSignedUrl(s3, command, { expiresIn: expireIn });
}

const deleteFile = async (key: string) => {
    console.log(AWSConfig.config.BUCKET_NAME);
    return await s3.send(new DeleteObjectCommand({
        Bucket: AWSConfig.config.BUCKET_NAME,
        Key: key
    }));
}
const deleteManyFiles = async (params: string[]) => {
    const objects = params.map(p => { return { Key: p } });

    return await s3.send(new DeleteObjectsCommand({
        Bucket: AWSConfig.config.BUCKET_NAME,
        Delete: {
            Objects: objects,
        },
    }))
}

export { s3, uploadFile, signedUrl, deleteFile, deleteManyFiles }
