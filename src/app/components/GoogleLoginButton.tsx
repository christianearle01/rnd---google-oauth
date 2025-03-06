"use client";

import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { useRouter } from "next/navigation";

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

interface GoogleCredentialResponse {
  credential?: string;
}

interface DecodedCredential {
  email: string;
  name: string;
  picture: string;
  sub: string;
  // Add other properties you might need
}

interface GoogleLoginButtonProps {
  redirectUrl?: string;
}

async function onLoginSuccess(id_token: string, redirectUrl: string, router:  ReturnType<typeof useRouter>) {
    await fetch('https://wren-flying-condor.ngrok-free.app/auth/google_signin', {
        method: 'POST',
        body: JSON.stringify({ id_token }),
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then((data) => {
        console.log('Success:', data);
        router.push(redirectUrl);
    })
    .catch((error) => {
        console.log("Error: ", error);
    });
}

export default function GoogleLoginButton({
  redirectUrl = "/dashboard" // Default redirect URL
}: GoogleLoginButtonProps = {}) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={async (response: GoogleCredentialResponse) => {
            setIsProcessing(true);
            console.log("Login Success:", response);

            // Decode the JWT token to get user information
            if(response.credential) {
                const decoded: DecodedCredential = jwtDecode(response.credential);
                console.log("User email:", decoded.email);
                console.log("User name:", decoded.name);
                console.log("User picture:", decoded.picture);

                console.log(`decoded: `, decoded);

                // Call optional success callback if provided
                if(decoded && onLoginSuccess){
                    await onLoginSuccess(response.credential, redirectUrl, router);
                }

                // You might want to send this data to your backend API first
                // For example with fetch or axios
                // await sendUserDataToBackend(decoded);

                // Then redirect
                // router.push(redirectUrl);
            }
          }}
          onError={() => {
            console.error("Login Failed");
            setIsProcessing(false);
          }}
          useOneTap
        />
        {isProcessing && (
          <p className="mt-2 text-sm text-gray-500">Processing login...</p>
        )}
      </div>
    </GoogleOAuthProvider>
  );
}
