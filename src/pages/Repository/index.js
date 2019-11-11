import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { WebView } from 'react-native-webview';

import { Container } from './styles';

export default class Repository extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('repository').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  state = {
    repositoryUrl: '',
  };

  async componentDidMount() {
    const { navigation } = this.props;
    this.setState({
      repositoryUrl: navigation.getParam('repository').html_url,
    });
  }

  render() {
    const { repositoryUrl } = this.state;

    return (
      <Container>
        <WebView source={{ uri: repositoryUrl }} />
      </Container>
    );
  }
}
