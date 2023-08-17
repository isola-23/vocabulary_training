// グローバル変数としてwordListを宣言
var wordList;

// レベルごとの単語リストのURLを定義
var beginnerWordListURL = "wordList_beginner.json";
var intermediateWordListURL = "wordList_intermediate.json";
var advancedWordListURL = "wordList_advanced.json";

// テストに関する変数
var level = "";
var wordIndex = 0;
var userAnswers = [];
var results = [];

// テストを開始する関数
function startTest(selectedLevel) {
  resetTest();

  // 選択したレベルに応じて単語リストのURLを設定
  var wordListURL;
  if (selectedLevel === "beginner") {
    wordListURL = beginnerWordListURL;
  } else if (selectedLevel === "intermediate") {
    wordListURL = intermediateWordListURL;
  } else if (selectedLevel === "advanced") {
    wordListURL = advancedWordListURL;
  }
  // 単語リストを読み込む
  fetch(wordListURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      wordList = data;

      // テスト開始ボタンとレベル選択を非表示にする
      var levelSelection = document.getElementById("levelSelection");
      levelSelection.style.display = "none";

      // テストの問題文を表示する
      showQuestion();

      // テスト結果を表示するコンテナを表示する
      var testContainer = document.getElementById("testContainer");
      testContainer.style.display = "block";
    })
    .catch(function (error) {
      console.error("単語リストの読み込みエラー:", error);
    });
}

// テストの問題文を表示する関数
function showQuestion() {
  // 問題文の取得
  var questionContainer = document.getElementById("questionContainer");
  if (!questionContainer) {
    console.error("問題文を表示する要素が存在しません。");
    return;
  }

  if (wordIndex >= wordList.length) {
    // テストが終了した場合、結果を表示する
    showTestResults();
    return;
  }

  var currentWord = wordList[wordIndex];

  // 問題文と選択肢の表示
  var questionText = "問題 " + (wordIndex + 1) + ": " + currentWord.word;
  questionContainer.textContent = questionText;

  var optionsContainer = document.getElementById("optionsContainer");
  optionsContainer.innerHTML = "";

  // 選択肢をシャッフルする
  var shuffledOptions = shuffleArray(currentWord.options);

  shuffledOptions.forEach(function (option) {
    var button = document.createElement("button");
    button.textContent = option;
    button.addEventListener("click", function () {
      checkAnswer(option);
    });
    optionsContainer.appendChild(button);
  });
}

// 配列をシャッフルする関数
function shuffleArray(array) {
  var shuffledArray = array.slice();
  for (var i = shuffledArray.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

// 回答をチェックする関数
function checkAnswer(selectedOption) {
  var currentWord = wordList[wordIndex];
  var isCorrect = currentWord.answer === selectedOption;
  userAnswers.push(selectedOption);
  results.push(isCorrect);

  // // 正誤結果を表示する
  // var resultContainer = document.getElementById("resultContainer");
  // resultContainer.innerHTML = "";
  // var resultText = isCorrect ? "正解！" : "不正解！ 正解は「" + currentWord.answer + "」";
  // resultContainer.textContent = resultText;

  // 次の問題に進む
  wordIndex++;

  // 次の問題を表示する
  showQuestion();
}

// テスト結果を表示する関数
function showTestResults() {
  // テスト結果の表示
  var resultContainer = document.getElementById("resultContainer");
  resultContainer.innerHTML = "";

  var correctCount = results.filter(function (result) {
    return result === true;
  }).length;

  var resultText =
    "テスト終了！ 正解数: " +
    correctCount +
    " / " +
    wordIndex +
    "<br><br>";

  // 各問題の正誤と回答を表示する
  for (var i = 0; i < results.length; i++) {
    var word = wordList[i].word;
    var answer = wordList[i].answer;
    var userAnswer = userAnswers[i];
    var isCorrect = results[i];

    resultText +=
      "問題 " +
      (i + 1) +
      ": " +
      word +
      "<br>" +
      "正解: " +
      answer +
      "<br>" +
      "回答: " +
      userAnswer +
      "<br>" +
      (isCorrect ? "正解！" : "不正解！ 正解は「" + answer + "」") +
      "<br><br>";
  }
  var restartButton = '<button id="restartButton">もう一度テストを開始</button>';
  var resetButton = '<button id="resetButton">初めに戻る</button>';

  resultContainer.innerHTML = "<p>" + resultText + "</p>";
  resultContainer.innerHTML += restartButton + resetButton;

  // テストの問題文を非表示にする
  var questionContainer = document.getElementById("questionContainer");
  questionContainer.innerHTML = ""; 

  // 選択肢をクリアする
  var optionsContainer = document.getElementById("optionsContainer");
  optionsContainer.innerHTML = "";

  // 「もう一度テストを開始」ボタンのクリックイベントを設定
  var restartButtonElement = document.getElementById("restartButton");
  restartButtonElement.addEventListener("click", restartTest);

  // 「初めに戻る」ボタンのクリックイベントを設定
  var resetButtonElement = document.getElementById("resetButton");
  resetButtonElement.addEventListener("click", resetTest);

  // テスト開始ボタンを活性化する
  var startButton = document.getElementById("startButton");
  startButton.disabled = false;
}

// テストをリセットする関数
function resetTest() {
  // レベル選択をリセット
  var levelSelect = document.getElementById("levelSelect");
  levelSelect.innerHTML = '<option value="beginner" selected>初級</option><option value="intermediate">中級</option><option value="advanced">上級</option>';

  // テスト結果をリセット
  wordIndex = 0;
  userAnswers = [];
  results = [];

  // テスト開始ボタンとレベル選択を表示する
  var levelSelection = document.getElementById("levelSelection");
  levelSelection.style.display = "block";

  // テスト開始ボタンを表示する
  var startButton = document.getElementById("startButton");
  startButton.style.display = "inline-block";

  // テストの問題文を非表示にする
  var questionContainer = document.getElementById("questionContainer");
  questionContainer.innerHTML = "";

  // 選択肢をクリアする
  var optionsContainer = document.getElementById("optionsContainer");
  optionsContainer.innerHTML = "";

  // テスト結果を表示するコンテナをクリアする
  var resultContainer = document.getElementById("resultContainer");
  resultContainer.innerHTML = "";
}


// テストを再開する関数
function restartTest() {
  // テスト結果をリセット
  wordIndex = 0;
  userAnswers = [];
  results = [];

  // テストの問題文を表示する
  showQuestion();

  // テスト結果を表示するコンテナをクリアする
  var resultContainer = document.getElementById("resultContainer");
  resultContainer.innerHTML = "";
}

// ページの読み込みが完了したら実行
window.onload = function () {
  var startButton = document.getElementById("startButton");
  if (startButton) {
    startButton.addEventListener("click", function() {
      var levelSelect = document.getElementById("levelSelect");
      var selectedLevel = levelSelect.value;
      startTest(selectedLevel);
    });
  }

  var restartButton = document.getElementById("restartButton");
  if (restartButton) {
    restartButton.addEventListener("click", resetTest);
  }

  var resetButton = document.getElementById("resetButton");
  if (resetButton) {
    resetButton.addEventListener("click", resetTest);
  }
};

