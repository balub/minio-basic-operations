var Minio = require("minio");

// Instantiate the minio client with the endpoint
// and access keys as shown below.
var minioClient = new Minio.Client({
  endPoint: "127.0.0.1",
  port: 8004,
  useSSL: false,
  accessKey: "AKIAIOSFODNN7EXAMPLE",
  secretKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
});

let bucketName = "balu-test-bucket";

function setBucketPolicy(bucketName) {
  //Policy to make the file public
  var policy = {
    Version: "2012-10-17",
    Statement: [
      {
        Action: ["s3:GetBucketLocation", "s3:ListBucket"],
        Effect: "Allow",
        Principal: {
          AWS: ["*"],
        },
        Resource: [`arn:aws:s3:::${bucketName}`],
        Sid: "",
      },
      {
        Action: ["s3:GetObject"],
        Effect: "Allow",
        Principal: {
          AWS: ["*"],
        },
        Resource: [`arn:aws:s3:::${bucketName}/*`],
        Sid: "",
      },
    ],
  };
  minioClient.setBucketPolicy(
    bucketName,
    JSON.stringify(policy),
    function (err) {
      if (err) throw err;
      console.log("Bucket policy set");
    }
  );
}

// Make a bucket
// minioClient.makeBucket(bucketName, "us-east-1", function (err) {
//   if (err) return console.log(err);
//   console.log("Bucket created successfully .");
//   //Set the bucket policy after its creation
//   setBucketPolicy(bucketName);
// });

//Add files to a created bucket
// [1, 2, 3, 4, 5, 6].map((fileName) => {
//   var file = `./images/${fileName}.jpg`;
//   minioClient.fPutObject(
//     bucketName,
//     `${fileName}.jpg`,
//     file,
//     function (err, etag) {
//       if (err) return console.log(err);
//       console.log("File uploaded successfully.");
//     }
//   );
// });

// Get URls for all Files uploaded in a bucket
var data = [];
var stream = minioClient.listObjects(bucketName, "", true);
stream.on("data", function (obj) {
  var publicUrl =
    minioClient.protocol +
    "//" +
    minioClient.host +
    ":" +
    minioClient.port +
    "/" +
    bucketName +
    "/" +
    obj.name;

  data.push(publicUrl);
});
stream.on("end", function (obj) {
  console.log(data);
});
stream.on("error", function (err) {
  console.log(err);
});
