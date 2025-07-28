export const AWS_RESOURCES = {
  dev: {
    Auth: {
      Cognito: {
        userPoolId: "ap-southeast-2_FsX4dd8Vz",
        userPoolClientId: "1qb4prqsl9i7m7gq07j2cv2em7",
        identityPoolId: "ap-southeast-2:1ed074f3-7df0-41ab-9c87-7e076682d174",
        loginWith: {
          email: true,
        },
        userAttributes: {
          email: {
            required: true,
          },
        },
        passwordFormat: {
          minLength: 8,
          requireLowercase: true,
          requireUppercase: true,
          requireNumbers: true,
          requireSpecialCharacters: true,
        },
      },
    },
    Storage: {
      S3: {
        region: "ap-southeast-2",
        bucket: "song-share-user-files-dev ",
      },
    },
    API: {
      REST: {
        main: {
          endpoint:
            "https://wnu6sp7amf.execute-api.ap-southeast-2.amazonaws.com/dev/",
          region: "ap-southeast-2",
        },
      },
    },
  },
};