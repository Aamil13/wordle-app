import { OtpInput } from "react-native-otp-entry";

export default function OTPField({
  onFilled,
}: {
  onFilled: (code: string) => void;
}) {
  return (
    <OtpInput
      numberOfDigits={6}
      onFilled={onFilled}
      focusColor="#000"
      theme={{
        pinCodeContainerStyle: {
          borderRadius: 10,
          width: 45,
          height: 55,
        },
      }}
    />
  );
}
