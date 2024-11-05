type MainPageProps = {
  setScreen: Function
}

export default function MainPage({setScreen}: MainPageProps) {
  return (
    <>
      <div>This is the header</div>
      <div>Thanks for logging in</div>
      <div>This is the footer</div>
    </>
  );
}