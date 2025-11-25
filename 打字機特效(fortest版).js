document.addEventListener("DOMContentLoaded", function() {
  const typewriterElements = document.querySelectorAll(".typewriter");
  typewriterElements.forEach(initTypewriter);
});

function initTypewriter(container) {
  // --- 1. 讀取參數 ---
  const initialText = container.dataset.text || "Initial text";
  const finalText = container.dataset.textFinal || "Final text";
  // [新增] 讀取目標網址
  const redirectUrl = container.dataset.redirect; 
  
  const typingSpeed = parseInt(container.dataset.speed) || 150;
  const deletingSpeed = parseInt(container.dataset.deleteSpeed) || 100;
  const pauseTime = parseInt(container.dataset.pause) || 1000;
  
  // (已移除 BGM 相關邏輯)

  // --- 2. 抓取元素 ---
  const textElement = container.querySelector(".typewriter-text");
  // [新增] 抓取提示詞
  const hintElement = container.querySelector(".hint"); 

  if (!textElement) {
    console.error("Typewriter setup error: missing .typewriter-text");
    return;
  }

  // --- 3. 狀態管理 ---
  // 新增狀態: 'waiting_for_redirect'
  let state = 'typing_initial'; 
  let index = 0;

  // --- 4. 核心函式 ---

  // (A) 打第一段字
  function typeInitialText() {
    if (index < initialText.length) {
      textElement.textContent += initialText.charAt(index);
      index++;
      setTimeout(typeInitialText, typingSpeed);
    } else {
      state = 'idle';
      index = 0; 
    }
  }
  // (B) 刪除函式
  function deleteLetter() {
    let currentLength = textElement.textContent.length;
    if (currentLength > 0) {
      textElement.textContent = textElement.textContent.substring(0, currentLength - 1);
      setTimeout(deleteLetter, deletingSpeed);
    } else {
      state = 'waiting'; 
      setTimeout(function() {
        state = 'typing_final';
        typeFinalText(); 
      }, pauseTime);
    }
  }
  // (C) 打第二段字
  function typeFinalText() {
    if (index < finalText.length) {
      textElement.textContent += finalText.charAt(index);
      index++;
      setTimeout(typeFinalText, typingSpeed);
    } else {
      // --- 全部打完 ---
      state = 'waiting_for_redirect'; // 進入等待跳轉狀態
      
      // 顯示 "Press anywhere" 提示詞
      if (hintElement) {
        hintElement.classList.add('show');
      }
    }
  }
  // (D) 點擊處理 (包含跳轉)
  function handleClick(event) {
    // 這裡不使用 preventDefault，除非你想阻止點擊提示詞以外的東西
    // event.preventDefault(); 
    
    // 1. 第一階段等待點擊 -> 刪除
    if (state === 'idle') {
      event.preventDefault(); // 這裡還是阻止一下比較好
      state = 'deleting';
      deleteLetter();
    }
    // 2. 第二階段等待點擊 -> 跳轉網頁
    else if (state === 'waiting_for_redirect') {
      event.preventDefault();
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        console.log("未設定跳轉網址 (data-redirect)");
      }
    }
  }
  // (E) 移除監聽
  function removeListeners() {
    document.removeEventListener('click', handleClick);
    document.removeEventListener('contextmenu', handleClick);
  }

  // --- 5. 啟動與綁定 ---
  document.addEventListener('click', handleClick);
  document.addEventListener('contextmenu', handleClick);
  
  typeInitialText();
}