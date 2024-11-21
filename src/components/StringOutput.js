import React, { useContext, useEffect } from 'react';
import { Button } from 'antd';
import '../css/StringOutput.css';
import { CreateSubscribedTopicString } from '../util/CreateSubscribedTopicString.js';
import { CreatePublishedTopicString } from '../util/CreatePublishedTopicString.js';
import { SessionContext } from '../util/helpers/solaceSession.js';

const StringOutput = ({generatedData}) => {
  const {
    subscribedTopicString,
    publishedTopicString,
    setPublishedTopicString,
    setSubscribedTopicString,
    columnData,
  } = useContext(SessionContext);

  const handleClickGenerate = () => {
    const subscribedTopicString = CreateSubscribedTopicString(generatedData);

    const emptyColumnIndex = findEmptyColumnIndex(columnData);

    if (emptyColumnIndex === -1) {
      setSubscribedTopicString(subscribedTopicString);
      return;
    }

    setPublishedTopicString('');
    setSubscribedTopicString('');
  };

  const findEmptyColumnIndex = (columnData) => {
    return columnData.findIndex((item, index) => {
      const hasDataBefore = columnData
        .slice(0, index)
        .some((col) => col.columnData.length > 0);
      const hasDataAfter = columnData
        .slice(index + 1)
        .some((col) => col.columnData.length > 0);
      return hasDataBefore && item.columnData.length < 1 && hasDataAfter;
    });
  };

  useEffect(() => {
    CreatePublishedTopicString(
      setPublishedTopicString,
      subscribedTopicString,
      columnData
    );
  }, [subscribedTopicString, setPublishedTopicString, columnData]);

  const getCharacterLength = (string) => {
    const cleanedString = string.replace(/[\s/]/g, '');
    return cleanedString.length;
  };

  return (
    <div className="content-container">
      <div className="topic-blocks">
        {/* Published Topic */}
        <div className="publisher-block">
          <div className="block-title">
            <h3>Producer publishes to:</h3>
            <div className="character-counter">
              <p>
                Characters:{' '}
                {publishedTopicString
                  ? getCharacterLength(publishedTopicString)
                  : 0}{' '}
                / 200
              </p>
            </div>
          </div>
          <div className="publisher-text-block">
            {publishedTopicString ? (
              <p className="published-topic-body">{publishedTopicString}</p>
            ) : (
              <p className="published-topic-body">
                Press "Generate" to get started.
              </p>
            )}
          </div>
        </div>

        {/* Subscriber Topic */}
        <div className="subscriber-block">
          <div className="block-title">
            <h3>Consumer subscribes to:</h3>
            <div className="character-counter">
              <p>
                Characters:{' '}
                {subscribedTopicString
                  ? getCharacterLength(subscribedTopicString)
                  : 0}{' '}
                / 200
              </p>
            </div>
          </div>
          <div className="subscriber-text-block">
            {subscribedTopicString ? (
              <p className="topic-string-text">{subscribedTopicString}</p>
            ) : (
              <p>Press "Generate" to get started.</p>
            )}
          </div>
        </div>
      </div>

      <div className="button-container">
        <Button className="custom-antd-button" onClick={handleClickGenerate}>
          GENERATE
        </Button>
      </div>
    </div>
  );
};

export default StringOutput;
