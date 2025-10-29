import { StyleSheet, Text, View } from 'react-native';

export default function buyerScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Buyers Listed Here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'black',
  },
});
