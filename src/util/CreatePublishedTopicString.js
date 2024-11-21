const CELL_ERROR = 'missing_property';  
  
/**  
 * Creates a published topic string by processing the subscribed topic string and column data.  
 * 
 * @param {function} setPublishedTopicString - A function to set the published topic string.  
 * @param {string} subscribedTopicString - The subscribed topic string to process.  
 * @param {array} columnData - An array of column data objects.  
 */  
export const CreatePublishedTopicString = (setPublishedTopicString, subscribedTopicString, columnData) => {  
  const cleanedString = subscribedTopicString.trim();  
  let updatedString = cleanedString;  
  
  // Filter out columns with no data  
  columnData = columnData.filter(item => item.columnData.length >= 1);  
  
  // If the cleaned string does not contain '>' or '*', return the original string  
  if (!cleanedString.includes(">") && !cleanedString.includes("*")) {  
  setPublishedTopicString(subscribedTopicString);  
  return;  
  }  
  
  // Process '>' in the subscribed topic string  
  if (hasTrailingGreaterThan(updatedString) || hasLeadingGreaterThan(updatedString) || hasGreaterThanWithWhitespace(updatedString)) {  
  const columnIndex = getGreaterThanIndex(subscribedTopicString);  
  const remainingCells = getRemainingCellValues(columnData, columnIndex);  
  updatedString = removeGreaterThan(updatedString);  
  
  remainingCells.forEach(item => {  
  if (item) {  
    updatedString = updatedString.concat(` / ${item}`);  
  }  
  });  
  }  
  
  // Process '*' in the subscribed topic string  
  if (updatedString.includes("*")) {  
  const instances = getWildcardInstances(subscribedTopicString);  
  instances.forEach(columnIndex => {  
  const newVal = getRandomCellValue(columnData, columnIndex);  
  if (!newVal) {  
    updatedString = updatedString.replace("*", CELL_ERROR);  
  }  
  updatedString = updatedString.replace("*", newVal);  
  });  
  }  
  
  setPublishedTopicString(updatedString);  
};  
  
/**  
 * Checks if the string has a '>' at the end with optional whitespace before it.  
 * 
 * @param {string} str - The string to check.  
 * @returns {boolean} True if the string has a '>' at the end with optional whitespace before it.  
 */  
const hasTrailingGreaterThan = str => /\s*>$/g.test(str);  
  
/**  
 * Checks if the string has a '>' at the beginning with optional whitespace after it.  
 * 
 * @param {string} str - The string to check.  
 * @returns {boolean} True if the string has a '>' at the beginning with optional whitespace after it.  
 */  
const hasLeadingGreaterThan = str => /^\s*>/.test(str);  
  
/**  
 * Checks if the string has a '>' with whitespace before and after it.  
 * 
 * @param {string} str - The string to check.  
 * @returns {boolean} True if the string has a '>' with whitespace before and after it.  
 */  
const hasGreaterThanWithWhitespace = str => /\s*>[\s]*$/.test(str);  
  
/**  
 * Gets the index of the '>' in the subscribed topic string.  
 * 
 * @param {string} str - The subscribed topic string.  
 * @returns {number} The index of the '>'.  
 */  
const getGreaterThanIndex = str => str.split(" / ").findIndex(item => item === ">");  
  
/**  
 * Removes the '>' from the string.  
 * 
 * @param {string} str - The string to remove the '>' from.  
 * @returns {string} The string with the '>' removed.  
 */  
const removeGreaterThan = str => str.replace(/\s*\/\s*>$/, "");  
  
/**  
 * Gets the remaining cell values after the specified index.  
 * 
 * @param {array} columnData - An array of column data objects.  
 * @param {number} columnIndex - The index to start getting remaining cell values from.  
 * @returns {array} An array of remaining cell values.  
 */  
const getRemainingCellValues = (columnData, columnIndex) => {  
  let randomValues = [];  
  
  // Loop through all columns - including and after - the specified index  
  for (let i = columnIndex; i < columnData.length; i++) {  
  const column = columnData[i];  
  
  if (column && column.columnData && column.columnData.length > 0) {  
  const allItemsAreWild = column.columnData.every(item => item === ">" || item === "*");  
  if ((column.columnData.length === 1 && column.columnData[0] === ">") || allItemsAreWild) {  
    randomValues.push(CELL_ERROR);  
  }
  const availableItems = column.columnData.filter(item => item !== ">" && item !== "*");  
  
  if (availableItems.length > 0) {  
    const newVal = getRandomCellValue(columnData, i);  
  
    if (newVal !== undefined) {  
    randomValues.push(newVal);  
    }  
  }  
  }  
  }  
  return randomValues.length > 0 ? randomValues : [CELL_ERROR];  
};  
  
/**  
 * Gets the instances of '*' in the subscribed topic string.  
 * 
 * @param {string} str - The subscribed topic string.  
 * @returns {array} An array of indices where '*' is found.  
 */  
const getWildcardInstances = str => {  
  const instances = [];  
  const topicSplit = str.split(" / ");  
  
  topicSplit.forEach((item, index) => {  
  if (item === "*") {  
  instances.push(index);  
  }  
  });  
  return instances;  
};  
  
/**  
 * Gets a random cell value from the specified column index.  
 * 
 * @param {array} columnData - An array of column data objects.  
 * @param {number} columnIndex - The index of the column to get a random value from.  
 * @returns {string} A random cell value or CELL_ERROR if no value is found.  
 */  
const getRandomCellValue = (columnData, columnIndex) => {  
  const column = columnData[columnIndex];  
  
  if (column && column.columnData && column.columnData.length > 0) {  
  const availableItems = column.columnData.filter(item => item !== ">" && item !== "*");  
  
  const allItemsAreWild = column.columnData.every(item => item === ">" || item === "*");  
  if ((column.columnData.length === 1 && column.columnData[0] === "*") || allItemsAreWild) {  
    return CELL_ERROR;  
  }
  
  
  const randomIndex = Math.floor(Math.random() * availableItems.length);  
  const randomValue = availableItems[randomIndex];  
  
  return randomValue ? randomValue : CELL_ERROR;  
  }  
};
