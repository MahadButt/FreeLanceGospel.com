import React, { useState } from 'react';
import { useHistory } from "react-router";
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption
} from 'reactstrap';
import './Forum.scss'
import { API_ROOT } from "../../../utils/consts";
import moment from 'moment'
import { Icon } from "semantic-ui-react";

const Example = ({forums}) => {
  const history = useHistory();
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  // console.log(forums)
  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === forums.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  }

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? forums.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  }

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  }

  const slides =  forums.map((item) => {
    return (
      <CarouselItem
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={item.id}
      >
        <div className="box-wrapper">
          <div className="item-wrapper">
            <div className="title">
              {item.title}
            </div>
            <div className="view-replies">
              <div className="views">Views: {item.views}</div>
              <div className="replies">Replies: {item.replies}</div>
            </div>
            <div className="last-post">
              <div className="label">Last Post</div>
              <div className="data">
                {
                  item.lastReply && 
                  item.lastReply.user && 
                  item.lastReply.user.church_title ? item.lastReply.user.church_title 
                  : 
                  'No replies yet'
                }
              </div>
              <div className="time">
                {
                  item.lastReply && item.lastReply.created_at &&
                  moment(item.lastReply.created_at).fromNow()
                }
              </div>
            </div>
            <div className="see-detail-btn" onClick={() => history.push("/forum-post?post_id=" + item.id)}>
              See Detail
            </div>
          </div>
        </div>
      </CarouselItem>
    );
  });

  return (
    <div className="forum-wrapper">
      <Carousel
        activeIndex={activeIndex}
        next={next}
        previous={previous}
      >
        <CarouselIndicators items={forums} activeIndex={activeIndex} onClickHandler={goToIndex} />
        {slides}
        <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous} />
        <CarouselControl direction="next" directionText="Next" onClickHandler={next} />
      </Carousel>
    </div>
  );
}

export default Example;