/*
  ⚠️ WARNING: This replicates a Drupal component.
*/
import React from 'react';
import PropTypes from 'prop-types';

import Column from '@components/Column';
import Row from '@components/Row';
import SectionHeader from '@components/SectionHeader';
import Deck from '@components/Deck';
import Card from '@components/Card';

import './AffordableHousingInfo.scss';

function AffordableHousingInfo() {
  const placeholderImage = {
    "src": "/images/placeholder.png",
    "srcSet": "/images/placeholder.png 1x, /images/placeholder@2x.png 2x, /images/placeholder@3x.png 3x",
    "width": "284",
    // "height": "166",
    "alt": " ",
  };
  const feed = [
    {
      "img": placeholderImage,
      "title": "Different Kinds of Affordable Housing",
    },
    {
      "img": placeholderImage,
      "title": "Qualifying for Affordable Housing",
    },
    {
      "img": placeholderImage,
      "title": "See Our Latest Development Projects",
    },
    {
      "img": placeholderImage,
      "title": "Find Emergency Housing",
    },
  ];

  return (
    <Row as="section">
      <Column className="ml-affordable-housing-info" jumbotron>
        <SectionHeader>Learn About Affordable Housing</SectionHeader>
        <Deck>{
          feed.map( ( entry, index ) => (
            <Card key={ index } href="#">
              <Card.Image { ...entry.img } />
              <Card.Text>
                <Card.TopicText slot="topic-text">Topic:</Card.TopicText>
                <Card.Title slot="title">{ entry.title }</Card.Title>
              </Card.Text>
            </Card>
          ) )
        }</Deck>
      </Column>
    </Row>
  );
}

AffordableHousingInfo.propTypes = {
  "children": PropTypes.node,
};

export default AffordableHousingInfo;
