const wrapper = document.querySelector(".wrapper");
const content = document.querySelector(".content");
const phonetic = document.querySelector(".phonetic");
const searchInput = wrapper.querySelector("input");
const infoText = wrapper.querySelector(".info-text");
const synonym = document.querySelector(".synonyms .list");
const removeIcon = wrapper.querySelector(".search span");

const displayData = (res, word) => {
  console.log(res.data[0], word);
  wrapper.classList.add("active");
  document.querySelector(".word p").innerText = res.data[0].word;
  content.innerHTML = null;
  phonetic.innerHTML = null;

  let phonetics = res.data[0].phonetics;
  let meanings = res.data[0].meanings;
  let synonyms = [];
  let antonyms = [];

  phonetics.forEach((el) => {
    if (el.text && el.audio) {
      let div = document.createElement("div");
      let p = document.createElement("p");
      p.innerText = el.text;
      p.style.fontSize = "12px";
      let i = document.createElement("i");
      i.classList.add("fas", "fa-volume-up");
      let audio = new Audio(el.audio);
      i.addEventListener("click", () => {
        audio.play();
      });
      div.append(p, i);
      phonetic.append(div);
    }
  });

  meanings.forEach((el) => {
    let meaning = el.definitions[0].definition;
    let example = el.definitions[0].example;
    synonyms = [...synonyms, ...el.synonyms];
    antonyms = [...antonyms, ...el.antonyms];

    if (meaning) {
      let li = document.createElement("li");
      li.classList.add("meaning");
      let div = document.createElement("div");
      div.classList.add("details");

      let meaningDiv = document.createElement("div");
      meaningDiv.style.display = "flex";
      meaningDiv.style.justifyContent = "space-between";

      let p = document.createElement("p");
      p.innerText = "Meaning";
      let h6 = document.createElement("h6");
      h6.textContent = el.partOfSpeech;
      meaningDiv.append(p, h6);

      let span = document.createElement("span");
      span.innerText = meaning;

      div.append(meaningDiv, span);

      if (example) {
        let detaildiv = document.createElement("div");
        detaildiv.classList.add("details");
        let detailp = document.createElement("p");
        detailp.innerText = "Example";
        let detailspan = document.createElement("span");
        detailspan.innerText = example;
        detaildiv.append(detailp, detailspan);
        li.append(div, detaildiv);
      } else {
        li.append(div);
      }
      content.append(li);
    }
  });

  const synAnt = (label) => {
    let arr = label === "synonyms" ? synonyms : antonyms;
    let li = document.createElement("li");
    li.classList.add("synonyms");
    let div = document.createElement("div");
    div.classList.add("details");
    let p = document.createElement("p");
    p.textContent = label[0].toUpperCase() + label.slice(1);
    let listDiv = document.createElement("div");
    listDiv.classList.add("list");
    for (let i = 0; i < arr.length && i < 10; i++) {
      let span = document.createElement("span");
      span.textContent = `${arr[i]},`;
      span.onclick = () => {
        search(arr[i]);
      };
      listDiv.append(span);
    }
    div.append(p, listDiv);
    li.append(div);
    content.append(li);
  };
  if (synonyms.length) synAnt("synonyms");
  if (antonyms.length) synAnt("antonyms");
};

const displayError = (err, word) => {
  console.log(err, word);
  infoText.innerHTML = `<span>Sorry, </span>${err.response.data.message.slice(
    11
  )} <p>${err.response.data.resolution}<p>`;
};

const fetchApi = (word) => {
  infoText.style.color = "#000";
  infoText.innerHTML = `Searching the meaning of <span>"${word}"</span>`;
  axios
    .get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then((res) => displayData(res, word))
    .catch((err) => displayError(err, word));
};

searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter" && e.target.value) {
    fetchApi(e.target.value);
  }
});

function search(word) {
  fetchApi(word);
  searchInput.value = word;
}

removeIcon.addEventListener("click", () => {
  searchInput.value = "";
  searchInput.focus();
  wrapper.classList.remove("active");
  infoText.style.color = "#9A9A9A";
  infoText.innerHTML =
    "Type a word and press enter to get meaning, example, pronunciation, and synonyms of a word";
});
