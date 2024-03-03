import { useState, useEffect } from "react";
import qs from "qs";
import CryptoJS from "crypto-js";
import axios from "axios";
// import config from '../config';

// const CLIENT_ID: string = config.CLIENT_ID;
// const REDIRECT_URI: string = config.REDIRECT_URI;

const CLIENT_ID: string = "ec34fc61d097445891233f904b7fd961";
const REDIRECT_URI: string = "http://localhost:5173";

const useSpotifyAuth = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [userCode, setUserCode] = useState<string | null>(null);
  const [codeVerifier, setCodeVerifier] = useState<string | null>(null);

  const getAccessToken = async () => {
    const code: string | null = localStorage.getItem("codeVerifier");
    if (!localStorage.getItem("userCode") || !code) {
      return;
    }
    if (
      !localStorage.getItem("accessToken") ||
      localStorage.getItem("accessToken") === "undefined"
    ) {
      try {
        const authParams = {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          data: qs.stringify({
            grant_type: "authorization_code",
            code: userCode,
            redirect_uri: REDIRECT_URI,
            client_id: CLIENT_ID,
            code_verifier: code,
          }),
        };

        const response = await axios.post(
          "https://accounts.spotify.com/api/token",
          authParams.data,
          { headers: authParams.headers }
        );
        const data = response.data;
        console.log(data);
        setAccessToken(data.access_token);
        setRefreshToken(data.refresh_token);
        localStorage.setItem("accessToken", data.access_token);
        localStorage.setItem("accessTokenTimestamp", Date.now().toString());
        localStorage.setItem("refreshToken", data.refresh_token);
        // localStorage.removeItem('codeVerifier');
      } catch (error) {
        console.error("Error obtaining access token", error);
      }
    }
  };

  const generateCodeVerifier = (): string => {
    const buffer = CryptoJS.lib.WordArray.random(64);
    return buffer.toString(CryptoJS.enc.Hex);
  };

  const generateCodeChallenge = (codeVerifier: string): string => {
    const hash = CryptoJS.SHA256(codeVerifier);
    return hash
      .toString(CryptoJS.enc.Base64)
      .replace("+", "-")
      .replace("/", "_")
      .replace(/=+$/, "");
  };

  const redirectToSpotifyAuth = () => {
    const verifier: string = generateCodeVerifier();
    const challenge: string = generateCodeChallenge(verifier);
    localStorage.setItem("codeVerifier", verifier);
    const storedVerifier = localStorage.getItem("codeVerifier");
    if (storedVerifier && storedVerifier.length > 10) {
      const authUrl: string = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
        REDIRECT_URI
      )}&scope=playlist-modify-private&code_challenge_method=S256&code_challenge=${challenge}`;
      window.location.href = authUrl;
    }
  };

  const checkAccessTokenExpiration = () => {
    const timestamp: string | null = localStorage.getItem(
      "accessTokenTimestamp"
    );
    if (timestamp) {
      const currentTime: number = Date.now();
      const oneHour: number = 60 * 60 * 1000;
      if (currentTime - parseInt(timestamp) > oneHour) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("accessTokenTimestamp");
        redirectToSpotifyAuth();
      }
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const newUserCode: string | null = urlParams.get("code");
    const accessToken: string | null = localStorage.getItem("accessToken");

    if (accessToken) {
      checkAccessTokenExpiration();
    }

    if (newUserCode) {
      localStorage.setItem("userCode", "");
      setTimeout(() => {
        localStorage.setItem("userCode", newUserCode as string);
        setUserCode(newUserCode);
      }, 500);
    } else {
      const storedUserCode: string | null = localStorage.getItem("userCode");
      if (storedUserCode) {
        setUserCode(storedUserCode);
      }
    }

    if (
      localStorage.getItem("codeVerifier") === "undefined" ||
      !localStorage.getItem("codeVerifier")
    ) {
      redirectToSpotifyAuth();
    }
    // eslint-disable-next-line  // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (
      localStorage.getItem("accessToken") === "undefined" ||
      !localStorage.getItem("accessToken")
    ) {
      getAccessToken();
    } else {
      setAccessToken(localStorage.getItem("accessToken"));
    }
    // eslint-disable-next-line
  }, [userCode]);

  return {
    accessToken,
    refreshToken,
    userCode,
    codeVerifier,
    redirectToSpotifyAuth,
    getAccessToken,
    setUserCode,
    setCodeVerifier,
    // Additional functionality can be added here as needed
  };
};

export default useSpotifyAuth;
