// eslint-disable-next-line
import OSS from "ali-oss";

const user_id = 100000931;
const workspace_id = 135;

const RspStorageType = {
  OSS: 1,
  COS: 2,
  AWS: 3,
};

class AttachmentAdapter {
  _instance;
  constructor() {
    // Use the getInstance interface
  }
  static getInstance() {
    return this._instance || (this._instance = new AttachmentAdapter());
  }
  getStsToken({ userID, workspaceID }) {
    const storage_conf = {
      storage_type: 1,
      access_key_id: "STS.NUZRKqP43JXsUDp2rRTQdNzLe",
      access_key_secret: "CRgusYWFxBBayhwPGdoaq3dtJ6wb36a3SUG7R1jsyXGN",
      sts_token:
        "CAIS5QJ1q6Ft5B2yfSjIr5bvGfHFvesS/ZqYV2LB1nIHWN5Iob/nhzz2IHBNeHRpCekfsfg2lGBZ6vwalrloU4VITEDFa8Rc44pa9QS5O2tXByQ5tO5qsoasPETOId+SvqaLES6QLr70fvOqdCqL9Etayqf7cjOPRkGsNYbz57dsctUQWHvfD19BH8wEHhZ+j8UYOHDNT+/PVCTnmW3NFkFllxNhgGdkk8SFz9ab9wDVgS/HqNQcrJ+jJYO/PYs+fsVtXtiymfBxM7HZyiNZ5xlM++B6i6dZ/nDYucueGEFY6BjfaLeTo9MxdF9yb/dnEfcd8aigxadx5+CPx9ypkE1GMLlYWXqYBqLYmZKaRrL0bY5oKu6iZySSguribMel71kWBlsALx5PdtYbLXt9NAchUDmyKNX8qAmWP17zEvHajPhmgcsplQ3yg8GSPVWGT7Sf3iEDIZEha0chPBUbxnfxxBuqnYOOkjkagAFZphBO96o0/IRLjVNbfbYoqMI/Y9uiTyPFyR4eoTjFmHFNm658YX41jnVXvqYsMQUG4tj3XeWL4vP70ALh9gacMTw9mc6ed43hfuO+qfzIZYoQ7uX3+bfl38MPIM+XQMbotTHuKbcOC2bli9+eC2s41uWRaXU5hapi9srA16+KLiAA",
      bucket: "zego-to-spreading",
      region: "ap-southeast-1",
      upload_dir: "docuo/workspace135/9f608ca75b1158482a5d480633ce0eb6",
      expired: 3600,
    };

    return storage_conf;
  }
  getOSSInstance(region, accessKeyId, accessKeySecret, stsToken, bucket) {
    const client = new OSS({
      region: `oss-${region}`,
      accessKeyId,
      accessKeySecret,
      stsToken,
      bucket,
      timeout: 6000000,
      refreshSTSToken: async () => {
        return {
          accessKeyId,
          accessKeySecret,
          stsToken,
        };
      },
      refreshSTSTokenInterval: 36000000,
    });
    return client;
  }
  async uploadFile({
    userID = user_id,
    workspaceID = workspace_id,
    file,
    fileName = "",
  }) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        const storageConf = await this.getStsToken({ userID, workspaceID });
        const {
          storage_type,
          access_key_id,
          access_key_secret,
          sts_token,
          bucket,
          region,
          upload_dir,
          expired,
        } = storageConf;
        if (storage_type === RspStorageType.OSS) {
          const client = this.getOSSInstance(
            region,
            access_key_id,
            access_key_secret,
            sts_token,
            bucket
          );
          const path = `${upload_dir}/${fileName || file.name}`;
          const headers = {
            // 指定上传文件的类型。
            // 'Content-Type': 'text/html',
            // 指定该Object被下载时网页的缓存行为。
            // 'Cache-Control': 'no-cache',
            // 指定该Object被下载时的名称。
            // 'Content-Disposition': 'oss_download.txt',
            // 指定该Object被下载时的内容编码格式。
            // 'Content-Encoding': 'UTF-8',
            // 指定过期时间。
            // 'Expires': 'Wed, 08 Jul 2022 16:57:01 GMT',
            // 指定Object的存储类型。
            // 'x-oss-storage-class': 'Standard',
            // 指定Object的访问权限。
            // 'x-oss-object-acl': 'private',
            // 设置Object的标签，可同时设置多个标签。
            // 'x-oss-tagging': 'Tag1=1&Tag2=2',
            // 指定CopyObject操作时是否覆盖同名目标Object。此处设置为true，表示禁止覆盖同名Object。
            // 'x-oss-forbid-overwrite': 'true',
          };
          console.log("Upload start");
          const result = await client.put(
            path,
            file
            // { headers }
          );
          console.log("Upload end", result.url);
          let temp = result.url;
          if (process.env.API_ENV === "prod") {
            const cdnDomain = "media-resource.spreading.io";
            const url = result.url.split("/");
            url.splice(2, 1, cdnDomain);
            temp = url.join("/");
          }
          resolve({ url: temp });
        } else if (storage_type === RspStorageType.COS) {
          resolve({ url: "" });
        } else if (storage_type === RspStorageType.AWS) {
          resolve({ url: "" });
        } else {
          resolve({ url: "" });
        }
      } catch (error) {
        console.error("[AttachmentAdapter]uploadFile", error);
        reject();
      }
    });
  }
  deleteFile() {
    // Not supported yet
  }
}

export default AttachmentAdapter.getInstance();
