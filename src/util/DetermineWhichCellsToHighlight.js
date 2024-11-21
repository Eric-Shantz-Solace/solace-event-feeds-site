export const DetermineWhichCellsToHighlight = (
  subscribedTopicString,
  columnData,
  params
) => {
  if (params.columnIndex === undefined) return;

  const currentColumnIndex = params.columnIndex;

  const highlightConfig = columnData.map((index) => ({
    columnIndex: index,
    cellsToHighlight: [],
  }));

  //Highlights selected values
  if (
    params.value !== '*' &&
    params.value !== '>' &&
    subscribedTopicString.split(' / ').includes(params.value)
  ) {
    if (
      checkForNonWildcardDuplicates(
        subscribedTopicString,
        params,
        currentColumnIndex
      )
    ) {
      if (params.value.length >= 1) {
        highlightConfig[currentColumnIndex].cellsToHighlight.push(params.value);
      }
    }
  }

  // Highlights all remaining cells when >
  if (subscribedTopicString.split(' / ').includes('>') && params.value) {
    if (
      subscribedTopicString.split(' / ').findIndex((item) => item === '>') <=
      currentColumnIndex
    ) {
      highlightConfig[currentColumnIndex].cellsToHighlight.push(params.value);
    }
  }

  // Highlight all cells in column when *
  if (subscribedTopicString.split(' / ').includes('*') && params.value) {
    if (checkForAsterixDuplicates(subscribedTopicString, currentColumnIndex)) {
      highlightConfig[currentColumnIndex].cellsToHighlight.push(params.value);
    }
  }

  const cellsToHighlight = highlightConfig[currentColumnIndex].cellsToHighlight;

  return cellsToHighlight.includes(params.value) ? 'highlighted-cell' : '';
};

const checkForNonWildcardDuplicates = (
  subscribedTopicString,
  params,
  currentColumnIndex
) => {
  const instances = [];
  const columnIndexOfValue = subscribedTopicString
    .split(' / ')
    .findIndex((item) => item === params.value);

  const topicSplit = subscribedTopicString.split(' / ');
  topicSplit.forEach((item, index) => {
    if (item === params.value) {
      instances.push(index);
    }
  });

  if (
    columnIndexOfValue === currentColumnIndex ||
    instances.includes(currentColumnIndex)
  ) {
    return true;
  }
};

const checkForAsterixDuplicates = (
  subscribedTopicString,
  currentColumnIndex
) => {
  const instances = [];
  const columnIndexOfValue = subscribedTopicString
    .split(' / ')
    .findIndex((item) => item === '*');

  const topicSplit = subscribedTopicString.split(' / ');
  topicSplit.forEach((item, index) => {
    if (item === '*') {
      instances.push(index);
    }
  });

  if (
    columnIndexOfValue === currentColumnIndex ||
    instances.includes(currentColumnIndex)
  ) {
    return true;
  }
};
