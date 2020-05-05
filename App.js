import React from 'react';
import { View, SafeAreaView, FlatList, Image, Dimensions, ActivityIndicator } from 'react-native';
import axios from 'axios';

const width = Dimensions.get('screen').width;

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      list: [],
      page: 1,
      loading: false
    }
  }

  componentDidMount() {
    this.getImages();
  }

  getImages = () => {
    const { list, page } = this.state;
    const api_key = "<your_api_key>";

    this.setState({ loading: true })

    // We are getting a few response data that's why get the response also so fast. This causes to state of the loading immeditately become false
    // That's why we can't see our loading indicator. To solve this problem we can use setTimeout to hold the setState not to trigger in order to see indicator for 2 seconds :)
    axios.get(`https://pixabay.com/api?key=${api_key}&per_page=10&page=${page}`)
      .then(res => {
        setTimeout(() => {
          this.setState({
            list: page === 1 ? res.data.hits : [...list, ...res.data.hits],
            loading: false
          })
        }, 2000)
      })
  }

  getMoreImages = () => {
    this.setState({
      page: this.state.page + 1
    }, () => this.getImages());
  };

  footerIndicator = () => {
    return this.state.loading ? (
      <View
        style={{
          padding: 20,
        }}>
        <ActivityIndicator animating size="large" />
      </View>
    ) : null
  };


  render() {
    return (
      <SafeAreaView>
        <FlatList
          data={this.state.list}
          renderItem={({ item }) => (
            <PreviewImage item={item} />
          )}
          keyExtractor={item => item.id.toString()}
          onEndReached={this.getMoreImages}
          ListFooterComponent={this.footerIndicator}
          onEndReachedThreshold={0.5}
        />
      </SafeAreaView>
    )
  }
}

const PreviewImage = (props) => {
  return (
    <View>
      <Image
        source={{ uri: props.item.webformatURL }}
        style={{ width: width, height: 400 }} />
    </View>
  )
}
