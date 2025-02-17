import { Amplify } from "aws-amplify"

export function configureAmplify() {

    Amplify.configure({
        Auth: {
            Cognito: {
            userPoolId: "ap-southeast-2_ECFGGKxov",
            userPoolClientId: "1oq1itjolj43u1o4ipfg5s22f0",
            loginWith: {
                email: true,
                username: true
            },
            signUpVerificationMethod: "email",
            userAttributes: {
                username: {
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
    })
}