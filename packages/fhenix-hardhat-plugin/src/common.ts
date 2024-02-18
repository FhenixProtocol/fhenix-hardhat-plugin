import axios from "axios";

export const getFunds = async (address: string, url?: string) => {
  const faucetUrl = url || `http://localhost:42000`;

  const response = await axios.get(`${faucetUrl}/faucet?address=${address}`);

  if (response.status !== 200) {
    throw new Error(
      `Failed to get funds from faucet: ${response.status}: ${response.statusText}`,
    );
  }

  if (!response.data?.message?.includes("ETH successfully sent to address")) {
    throw new Error(
      `Failed to get funds from faucet: ${JSON.stringify(response.data)}`,
    );
  }
};
