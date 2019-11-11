import Reactotron from 'reactotron-react-native';

if (__DEV__) {
  const tron = Reactotron.configure()
    .useReactNative({
      storybook: true,
    })
    .connect();

  // eslint-disable-next-line no-console
  console.tron = tron;

  tron.clear();
}
