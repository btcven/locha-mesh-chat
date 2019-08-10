import React, { Component } from "react";
import { View, Text, ScrollView, Image } from "react-native";
import Header from "./Header";
import { Container } from "native-base";
import ImagePicker from "react-native-image-crop-picker";
import { connect } from "react-redux";

class Gallery extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static navigationOptions = {
    header: null
  };

  render() {
    return (
      <Container>
        <Header {...this.props} />
        <View>
          <ScrollView
            contentContainerStyle={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap"
            }}
          >
            {this.props.photos.map((p, i) => {
              return (
                <View
                  key={i}
                  style={{
                    width: "33%"
                  }}
                >
                  <Image
                    style={{
                      height: 120,
                      width: 120
                    }}
                    source={{ uri: p.node.image.uri }}
                  />
                </View>
              );
            })}
          </ScrollView>
        </View>
      </Container>
    );
  }
}

const mapStatetoProps = state => ({
  photos: state.aplication.photos
});

export default connect(
  mapStatetoProps,
  null
)(Gallery);
