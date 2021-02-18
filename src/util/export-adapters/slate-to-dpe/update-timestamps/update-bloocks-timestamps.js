import { alignSTT } from 'stt-align-node';
import countWords, { removeExtraWhiteSpaces, splitOnWhiteSpaces } from '../../../count-words';

function convertWordsToText(words) {
  return words
    .map((word) => {
      return word.text.trim();
    })
    .join(' ');
}

function isTextAndWordsListChanged({ text, words }) {
  const wordsText = convertWordsToText(words);
  // TODO: here could optimize to check against word length
  // and only transpose the timcods
  return !(removeExtraWhiteSpaces(text) === wordsText);
}

function isEqualNumberOfWords({ text, words }) {
  const wordsText = convertWordsToText(words);
  const textCount = countWords(text);
  const wordsCount = countWords(wordsText);
  return textCount === wordsCount;
}

/**
 * @param {array} slateJsValue
 */
// TODO: Possible optimization, use onKeyDown to mark paragraphs that have changed
// then when running alignment only align those and no need to do diffing?
// could improve performance a bit by skipping a comparison step for each paragraph
// need to handle edge cases, eg deleting, deleting selection, etc..
function updateBloocksTimestamps(slateJsValue) {
  return slateJsValue.map((block) => {
    const text = block.children[0].text;
    const words = block.children[0].words;
    if (isTextAndWordsListChanged({ text, words })) {
      const newBlock = JSON.parse(JSON.stringify(block));
      // if same number of words in words list and text
      // then can do an optimization where you don't need to run diff
      // just transpose words onto the timecodes.
      // this assumes STT will be ok at recognising utterances
      // even if in worste case scenario it might have mis-identified the words
      if (isEqualNumberOfWords({ text, words })) {
        const textList = splitOnWhiteSpaces(text);
        const newWords = JSON.parse(JSON.stringify(words));
        newBlock.children[0].words = newWords.map((word, index) => {
          word.text = textList[index];
          return word;
        });
        return newBlock;
      }
      const alignedWords = alignSTT({ words }, text);
      newBlock.children[0].words = alignedWords;
      return newBlock;
    } else {
      return block;
    }
  });
}

export default updateBloocksTimestamps;
