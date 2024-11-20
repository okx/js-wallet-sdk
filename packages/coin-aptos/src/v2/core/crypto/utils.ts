import { HexInput } from "../../types";
import { Hex } from "../hex";

/**
 * Helper function to convert a message to sign or to verify to a valid message input
 *
 * @param message a message as a string or Uint8Array
 *
 * @returns a valid HexInput - string or Uint8Array
 */
export const convertSigningMessage = (message: HexInput): HexInput => {
  // if message is of type string, verify it is a valid Hex string
  if (typeof message === "string") {
    const isValid = Hex.isValid(message);
    // If message is not a valid Hex string, convert it into a Buffer
    if (!isValid.valid) {
      return Buffer.from(message, "utf8");
    }
    // If message is a valid Hex string, return it
    return message;
  }
  // message is a Uint8Array
  return message;
};
