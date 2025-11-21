import Register from "../home/register";

export const RegisterModal = ({ close, toModal }) => {
  return (
    <>
      <Register close={() => close()} toModal={toModal} />
    </>
  );
};
