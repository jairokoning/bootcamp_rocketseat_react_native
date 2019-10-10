import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import PropTypes from 'prop-types';

// import { Container } from './styles';

export default function Repository({ navigation }) {
  const repository = navigation.getParam('repository');

  return <WebView source={{ uri: repository.html_url }} style={{ flex: 1 }} />;
}

Repository.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
  }).isRequired,
};

Repository.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('repository').name,
});

// export default class WebPage extends Component {
//   static navigationOptions = ({ navigation }) => ({
//     title: navigation.getParam('repository').name,
//   });

//   static propTypes = {
//     navigation: PropTypes.shape({
//       getParam: PropTypes.func,
//     }).isRequired,
//   };

//   render() {
//     const { navigation } = this.props;
//     const repository = navigation.getParam('repository');

//     return (
//       <WebView source={{ uri: repository.html_url }} style={{ flex: 1 }} />
//     );
//   }
// }
