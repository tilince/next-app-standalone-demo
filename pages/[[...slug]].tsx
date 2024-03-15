import fs, { ReadStream } from "fs";
import path from "path";
import AttachmentAdapterImpl from "../module/attachment_adapter";

interface SlugData {
  params: {
    slug: string[];
  };
}

export async function getStaticProps(props: SlugData) {
  console.log("#######");
  // Upload img
  const uploadFile = async (file: File | ReadStream, fileName: string) => {
    const { url } = await AttachmentAdapterImpl.uploadFile({ file, fileName });
    return url;
  };
  const traverseFolder = (folderPath: string, promiseArr: any[]) => {
    const files = fs.readdirSync(folderPath);
    files.forEach(function (fileName) {
      const filePath = path.join(folderPath, fileName);

      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        traverseFolder(filePath, promiseArr);
      } else {
        const parseObj = path.parse(filePath);
        if (parseObj.ext.includes("png")) {
          const localFile = fs.createReadStream(filePath);
          promiseArr.push(uploadFile(localFile, fileName));
        }
      }
    });
  };
  const sizes = ["150k", "500k", "1m", "3m", "5m"];

  const dirPath1 = path.resolve("./public", "..", `uploadImage/${sizes[0]}`);
  const promiseArr1: any[] = [];
  console.time("150k upload timing");
  traverseFolder(dirPath1, promiseArr1);
  const result = await Promise.all(promiseArr1);
  console.timeEnd("150k upload timing");

  // const dirPath2 = path.resolve("./public", "..", `uploadImage/${sizes[1]}`);
  // const promiseArr2: any[] = [];
  // console.time("500k upload timing");
  // traverseFolder(dirPath2, promiseArr2);
  // const result = await Promise.all(promiseArr2);
  // console.timeEnd("500k upload timing");

  // const dirPath3 = path.resolve("./public", "..", `uploadImage/${sizes[2]}`);
  // const promiseArr3: any[] = [];
  // console.time("1m upload timing");
  // traverseFolder(dirPath3);
  // const result = await Promise.all(promiseArr3);
  // console.timeEnd("1m upload timing");

  // const dirPath4 = path.resolve("./public", "..", `uploadImage/${sizes[3]}`);
  // const promiseArr4: any[] = [];
  // console.time("upload timing");
  // traverseFolder(dirPath4, promiseArr4);
  // const result = await Promise.all(promiseArr4);
  // console.timeEnd("upload timing");

  // const dirPath5 = path.resolve("./public", "..", `uploadImage/${sizes[4]}`);
  // const promiseArr5: any[] = [];
  // console.time("5m upload timing");
  // traverseFolder(dirPath5, promiseArr5);
  // const result = await Promise.all(promiseArr5);
  // console.timeEnd("5m upload timing");

  console.log("result", result[0]);
  return {
    props: {
      slug: props.params.slug || null,
    },
  };
}

export function getStaticPaths() {
  const paths = [
    {
      params: {
        slug: ["page1"],
      },
    },
  ];

  return {
    paths,
    fallback: true,
  };
}

export default function DocPage(props: { slug: string }) {
  const { slug } = props;
  return <div>slug: {slug}</div>;
}
