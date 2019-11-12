import React, { Component } from 'react';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Loading,
  Author,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    page: 1,
    loading: true,
    refreshing: false,
  };

  async componentDidMount() {
    const { navigation } = this.props;
    const user = navigation.getParam('user');
    const { page } = this.state;

    const response = await api.get(
      `/users/${user.login}/starred?page=${String(page)}`
    );

    this.setState({ stars: response.data, loading: false });
  }

  handleNavigate = repository => {
    const { navigation } = this.props;

    navigation.navigate('Repository', { repository });
  };

  handleEndList = async () => {
    const { navigation } = this.props;
    const user = navigation.getParam('user');
    const { page } = this.state;
    const actualPage = page + 1;

    this.setState({ refreshing: true });

    const response = await api.get(
      `/users/${user.login}/starred?page=${String(actualPage)}`
    );

    if (response) {
      this.setState(prevState => ({
        stars: [...prevState.stars, ...response.data],
        page: actualPage,
        refreshing: false,
      }));
    }
  };

  refreshList = async () => {
    const { navigation } = this.props;
    const user = navigation.getParam('user');

    const response = await api.get(`/users/${user.login}/starred?page=1`);

    if (response) {
      this.setState({
        stars: response.data,
        page: 1,
        refreshing: false,
      });
    }
  };

  render() {
    const { navigation } = this.props;
    const { stars, refreshing, loading } = this.state;
    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>
        {loading ? (
          <Loading />
        ) : (
          <Stars
            data={stars}
            keyExtractor={star => String(star.id)}
            onEndReachedThreshold={0.2}
            onEndReached={this.handleEndList}
            refreshing={refreshing}
            onRefresh={this.refreshList}
            renderItem={({ item }) => (
              <Starred
                onPress={() => {
                  this.handleNavigate(item);
                }}
              >
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        )}
      </Container>
    );
  }
}
