import React, { useState } from 'react';
import { useHistory } from "react-router";
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption
} from 'reactstrap';
import './Stories.scss'
import { API_ROOT } from "../../../utils/consts";
import moment from 'moment'
import { Icon } from "semantic-ui-react";

const Example = ({stories}) => {
  const history = useHistory();
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  // console.log(stories)
  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === stories.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  }

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? stories.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  }

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  }

  const slides =  stories.map((item) => {
    return (
      <CarouselItem
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={item.id}
      >
        <div className="box-wrapper">
          <div className="left-box">
            <div className="image-preview">
              <img src={`https://thegospelpage.com/${item.preview_url}`} alt="image"/>
            </div>
            <div className="title">
              {item.title}
            </div>
          </div>
          <div className="right-box">
            <div className="right-inner-wrapper">
              <div className="avatar-wrapper">
                <img src={`https://thegospelpage.com/${item.user.avatar_url}`} alt="avatar" />
              </div>
              <div className="detail-wrapper">
                <div className="name-wrapper">
                  <div className="name1">
                    <div className="church-title">{item.user.church_title}</div>
                    <div className="f-name">{item.user.first_name}</div>
                  </div>
                  <div className="l-name">{item.user.last_name}</div>
                </div>
                <div className="time-ago">
                  <Icon className="icon" name="clock outline" />
                  <div className="time">
                    {
                      moment(item.created_at).fromNow()
                    }
                  </div>
                </div>
                <div className="see-detail-btn" onClick={() => history.push("/story?story_id=" + item.id)}>
                  See Detail
                </div>
              </div>
            </div>
          </div>
        </div>
      </CarouselItem>
    );
  });

  return (
    <div className="stories-wrapper">
      <Carousel
        activeIndex={activeIndex}
        next={next}
        previous={previous}
      >
        <CarouselIndicators items={stories} activeIndex={activeIndex} onClickHandler={goToIndex} />
        {slides}
        <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous} />
        <CarouselControl direction="next" directionText="Next" onClickHandler={next} />
      </Carousel>
    </div>
  );
}

export default Example;