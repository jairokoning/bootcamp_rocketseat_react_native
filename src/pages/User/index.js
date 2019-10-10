import React, { Component } from 'react';
import { ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
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
    loading: false,
    loadingMore: false,
    page: 1,
    refreshing: false,
  };

  async componentDidMount() {
    await this.setState({ loading: true });
    const { navigation } = this.props;
    const { page } = this.state;
    const user = navigation.getParam('user');

    const response = await api.get(`/users/${user.login}/starred?page=${page}`);

    this.setState({ stars: response.data, loading: false });
  }

  loadMore = async () => {
    await this.setState({ loadingMore: true });
    const { stars, page } = this.state;
    const { navigation } = this.props;
    const user = navigation.getParam('user');

    const newPage = page + 1;

    const response = await api.get(
      `/users/${user.login}/starred?page=${newPage}`
    );

    await this.setState({
      stars: [...stars, ...response.data],
      loadingMore: false,
      page: newPage,
    });
  };

  refreshList = async () => {
    await this.setState({ refreshing: true });

    const { navigation } = this.props;
    const user = navigation.getParam('user');

    const response = await api.get(`/users/${user.login}/starred?page=1`);

    this.setState({
      stars: response.data,
      refreshing: false,
      page: 1,
    });
  };

  handleNavigate = repository => {
    const { navigation } = this.props;
    // const user = navigation.getParam('user');
    navigation.navigate('WebPage', { repository });
  };

  render() {
    const { navigation } = this.props;
    const { stars, loading, loadingMore, refreshing } = this.state;
    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        {loading && (
          <ActivityIndicator
            style={{ height: 80 }}
            color="#7159c1"
            size="large"
          />
        )}

        <Stars
          onEndReachedThreshold={0.2}
          onEndReached={this.loadMore}
          onRefresh={this.refreshList}
          refreshing={refreshing}
          data={stars}
          keyExtractor={star => String(star.id)}
          renderItem={({ item }) => (
            <TouchableWithoutFeedback onPress={() => this.handleNavigate(item)}>
              <Starred>
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            </TouchableWithoutFeedback>
          )}
        />

        {loadingMore && (
          <ActivityIndicator
            style={{ height: 80 }}
            color="#7159c1"
            size="large"
          />
        )}
      </Container>
    );
  }
}
