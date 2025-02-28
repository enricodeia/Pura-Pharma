// Script WebGL per effetto transizione con GSAP per animazioni aggiuntive
(function() {
  // Aspetta che il DOM sia caricato
  document.addEventListener('DOMContentLoaded', function() {
    // Indice corrente e numero totale di slide
    let currentIndex = 0;
    const totalSlides = 8;
    
    // URL per il pulsante dinamico
    const buttonUrls = [
      "https://www.purapharma.eu/products/levacel-plus",
      "https://www.purapharma.eu/products/venestasi",
      "https://www.purapharma.eu/products/ansirem",
      "https://www.purapharma.eu/products/vitamina-d3",
      "https://www.purapharma.eu/products/b6-magnesio",
      "https://www.purapharma.eu/products/snell-fame",
      "https://www.purapharma.eu/products/rodiola-rosea",
      "https://www.purapharma.eu/products/tricopyl"
    ];
    
    // Imposta il link iniziale del pulsante
    const dynamicButton = document.getElementById('dinamic-button');
    if (dynamicButton) {
      dynamicButton.href = buttonUrls[0];
    }
    
    // Inizializza WebGL - La parte di WebGL è la stessa che abbiamo già implementato
    // ... [Il codice WebGL qui] ...
    
    // Inizializza variabili
    const canvas = document.getElementById('glcanvas');
    if (!canvas) {
      console.error("Canvas non trovato!");
      return;
    }
    
    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false }) || 
               canvas.getContext('experimental-webgl', { alpha: true, premultipliedAlpha: false });
    if (!gl) {
      console.error('Il browser non supporta WebGL');
      return;
    }
    
    // CONFIGURAZIONE IMMAGINI
    const imageUrls = [
      "https://cdn.prod.website-files.com/6749e677c74b3f0e424aab25/67b9fd4c3e67d334259d83ce_loader_img_01.webp",
      "https://cdn.prod.website-files.com/6749e677c74b3f0e424aab25/67b9fd4c3e839270d8f97d06_loader_img_03.webp",
      "https://cdn.prod.website-files.com/6749e677c74b3f0e424aab25/67b9fd4c2eb0b13ba75d0ffa_loader_img_02.webp",
      "https://cdn.prod.website-files.com/6749e677c74b3f0e424aab25/67ba512cc6e7b846dc086f84_pura_pharma_img04.webp",
      "https://cdn.prod.website-files.com/6749e677c74b3f0e424aab25/67ba571906fbea4e3cf49674_pura_pharma_img06%201.webp",
      "https://cdn.prod.website-files.com/6749e677c74b3f0e424aab25/67ba624c714c1b6114fb8d14_pura_pharma_img08.webp",
      "https://cdn.prod.website-files.com/6749e677c74b3f0e424aab25/67ba3c2b6a8f6134ad34a37e_pura_pharma_img03.webp",
      "https://cdn.prod.website-files.com/6749e677c74b3f0e424aab25/67bb3b57baa95ed68e28e2be_pura_pharma_img09.webp"
    ];
    
    let textures = [];
    let imageObjects = [];
    let imagesLoaded = 0;
    let nextIndex = null;
    let isAnimating = false;
    let transitionStart = 0;
    const transitionDuration = 1200; // Durata transizione
    
    // SHADER VERTEX
    const vertexShaderSource = `
      attribute vec2 a_position;
      attribute vec2 a_texCoord;
      varying vec2 v_texCoord;
      
      void main() {
        v_texCoord = a_texCoord;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;
    
    // SHADER FRAGMENT
    const fragmentShaderSource = `
      precision mediump float;
      
      uniform sampler2D u_from;
      uniform sampler2D u_to;
      uniform float progress;
      
      uniform float size;
      uniform float zoom;
      uniform float colorSeparation;
      
      varying vec2 v_texCoord;
      
      void main() {
        vec2 p = v_texCoord;
        float inv = 1.0 - progress;
        
        vec2 disp = size * vec2(cos(zoom * p.x), 0.0);
        
        vec4 texTo = texture2D(u_to, p + inv * disp);
        vec4 texFrom = texture2D(u_from, p + progress * disp);
        
        gl_FragColor = mix(texFrom, texTo, progress);
      }
    `;
    
    // FUNZIONI UTILITY
    function createShader(gl, type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Errore shader:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }
    
    function createProgram(gl, vertexShader, fragmentShader) {
      const program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Errore programma:', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
      }
      return program;
    }
    
    // Crea il buffer con aspect ratio corretto
    function createTextureQuad(aspectRatio) {
      const containerAspect = canvas.width / canvas.height;
      
      let scaleX = 1.0;
      let scaleY = 1.0;
      
      if (aspectRatio > containerAspect) {
        // L'immagine è più "larga" del canvas
        scaleY = containerAspect / aspectRatio;
      } else {
        // L'immagine è più "alta" del canvas
        scaleX = aspectRatio / containerAspect;
      }
      
      // Calcola le coordinate texture per un comportamento "cover"
      const texLeft = (1.0 - scaleX) / 2.0;
      const texRight = texLeft + scaleX;
      const texTop = (1.0 - scaleY) / 2.0;
      const texBottom = texTop + scaleY;
      
      // Positions (sempre un quadrato pieno)
      const positions = [
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
         1.0,  1.0
      ];
      
      // Coordinate texture
      const texCoords = [
        texLeft, texBottom,
        texRight, texBottom,
        texLeft, texTop,
        texRight, texTop
      ];
      
      return {
        positions: positions,
        texCoords: texCoords
      };
    }
    
    // Carica una texture da URL
    function loadTexture(gl, url, index, callback) {
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      
      // Texture placeholder
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
    
      const image = new Image();
      image.crossOrigin = "anonymous";
      
      image.onload = function() {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        
        // Salva l'immagine
        imageObjects[index] = image;
        callback(texture);
      };
      
      image.onerror = function() {
        callback(texture); // Usa la texture placeholder
      };
      
      image.src = url;
    }
    
    // Adegua le dimensioni del canvas
    function resizeCanvas() {
      const container = canvas.parentElement;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
      
      if (imagesLoaded === imageUrls.length && !isAnimating) {
        updateBuffersForImage(currentIndex);
        drawScene();
      }
    }
    
    // Aggiorna i buffer per aspect ratio
    function updateBuffersForImage(index) {
      if (!imageObjects[index]) return;
      
      const img = imageObjects[index];
      const aspectRatio = img.width / img.height;
      
      const quad = createTextureQuad(aspectRatio);
      
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(quad.positions), gl.STATIC_DRAW);
      gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 0, 0);
      
      gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(quad.texCoords), gl.STATIC_DRAW);
      gl.vertexAttribPointer(aTexCoordLoc, 2, gl.FLOAT, false, 0, 0);
    }
    
    // Imposta le dimensioni iniziali
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
    
    // Abilita il blending per transizioni più fluide
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    
    window.addEventListener('resize', resizeCanvas);
    
    // Inizializza gli shader
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    if (!vertexShader || !fragmentShader) {
      return;
    }
    
    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) {
      return;
    }
    
    gl.useProgram(program);
    
    // Buffer per vertici e texture coordinates
    const positionBuffer = gl.createBuffer();
    const texCoordBuffer = gl.createBuffer();
    
    // Attributi
    const aPositionLoc = gl.getAttribLocation(program, 'a_position');
    const aTexCoordLoc = gl.getAttribLocation(program, 'a_texCoord');
    
    gl.enableVertexAttribArray(aPositionLoc);
    gl.enableVertexAttribArray(aTexCoordLoc);
    
    // Uniform locations
    const u_fromLoc = gl.getUniformLocation(program, 'u_from');
    const u_toLoc = gl.getUniformLocation(program, 'u_to');
    const progressLoc = gl.getUniformLocation(program, 'progress');
    const sizeLoc = gl.getUniformLocation(program, 'size');
    const zoomLoc = gl.getUniformLocation(program, 'zoom');
    const colorSeparationLoc = gl.getUniformLocation(program, 'colorSeparation');
    
    // Imposta uniformi shader con i valori richiesti
    gl.uniform1f(sizeLoc, 0.14);
    gl.uniform1f(zoomLoc, 10.0);
    gl.uniform1f(colorSeparationLoc, 0.0);
    
    // Carica le texture
    for (let i = 0; i < imageUrls.length; i++) {
      loadTexture(gl, imageUrls[i], i, function(tex) {
        textures[i] = tex;
        imagesLoaded++;
        
        if (imagesLoaded === imageUrls.length) {
          updateBuffersForImage(currentIndex);
          setStaticImage(currentIndex);
          
          // Inizializza lo stato iniziale degli elementi UI
          initializeUIState();
        }
      });
    }
    
    // Imposta immagine statica
    function setStaticImage(index) {
      gl.uniform1f(progressLoc, 0.0);
      
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, textures[index]);
      gl.uniform1i(u_fromLoc, 0);
      
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, textures[index]);
      gl.uniform1i(u_toLoc, 1);
      
      drawScene();
    }
    
    // Disegna la scena
    function drawScene() {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    
    // Gestisce transizione WebGL
    function animateTransition() {
      isAnimating = true;
      transitionStart = performance.now();
      
      // Prima dell'inizio dell'animazione, aggiorna i buffer per l'immagine di partenza
      updateBuffersForImage(currentIndex);
      
      function animate(time) {
        let t = (time - transitionStart) / transitionDuration;
        if (t > 1) t = 1;
        
        // Easing più delicato
        const easedProgress = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        gl.uniform1f(progressLoc, easedProgress);
        drawScene();
        
        if (t < 1) {
          requestAnimationFrame(animate);
        } else {
          // Imposta completamente la nuova immagine
          currentIndex = nextIndex;
          
          // Aggiorna i buffer per la nuova immagine
          updateBuffersForImage(currentIndex);
          
          // Azzera il progress e imposta le texture correttamente
          gl.uniform1f(progressLoc, 0.0);
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, textures[currentIndex]);
          gl.uniform1i(u_fromLoc, 0);
          gl.activeTexture(gl.TEXTURE1);
          gl.bindTexture(gl.TEXTURE_2D, textures[currentIndex]);
          gl.uniform1i(u_toLoc, 1);
          
          isAnimating = false;
          drawScene();
        }
      }
      
      requestAnimationFrame(animate);
    }
    
    // Funzioni GSAP per animare gli elementi dell'interfaccia
    
    // Inizializza lo stato degli elementi UI
    function initializeUIState() {
      // Prepara tutti gli elementi per lo stato iniziale
      
      // 1. Titoli: nascondi tutti tranne il primo
      for (let i = 2; i <= totalSlides; i++) {
        gsap.set(`.product_title.is--0${i}`, { y: 100 });
      }
      
      // 2. Sottotitoli: nascondi tutti tranne il primo
      for (let i = 2; i <= totalSlides; i++) {
        gsap.set(`.product_sub.is--0${i}`, { opacity: 0, filter: 'blur(10px)' });
      }
      
      // 3. Box immagini: nascondi tutti tranne il primo
      for (let i = 2; i <= totalSlides; i++) {
        gsap.set(`.image_box.is--0${i}`, { scale: 0, opacity: 0 });
      }
      
      // 4. Paragrafi: nascondi tutti tranne il primo
      for (let i = 2; i <= totalSlides; i++) {
        gsap.set(`.product_paragraph.is--0${i}`, { opacity: 0, y: 30, filter: 'blur(10px)' });
      }
    }
    
    // Funzione per animare tra slide
    function animateToSlide(fromIndex, toIndex, direction) {
      // Calcola gli indici corretti (1-based per le classi)
      const fromIdx = fromIndex + 1;
      const toIdx = toIndex + 1;
      
      // Formatta gli indici per le classi (01, 02, etc)
      const fromStr = fromIdx < 10 ? `0${fromIdx}` : fromIdx;
      const toStr = toIdx < 10 ? `0${toIdx}` : toIdx;
      
      // Durata delle animazioni GSAP
      const duration = 0.6;
      const stagger = 0.1;
      
      // Timeline GSAP per sincronizzare le animazioni
      const tl = gsap.timeline();
      
      // 1. Anima i titoli
      tl.to(`.product_title.is--${fromStr}`, {
        y: direction > 0 ? -100 : 100,
        duration: duration,
        ease: "power2.inOut"
      }, 0);
      
      tl.fromTo(`.product_title.is--${toStr}`, {
        y: direction > 0 ? 100 : -100
      }, {
        y: 0,
        duration: duration,
        ease: "power2.inOut"
      }, 0);
      
      // 2. Anima i sottotitoli
      tl.to(`.product_sub.is--${fromStr}`, {
        opacity: 0,
        filter: 'blur(10px)',
        duration: duration,
        ease: "power2.inOut"
      }, 0.1);
      
      tl.fromTo(`.product_sub.is--${toStr}`, {
        opacity: 0,
        filter: 'blur(10px)'
      }, {
        opacity: 1,
        filter: 'blur(0px)',
        duration: duration,
        ease: "power2.inOut"
      }, 0.2);
      
      // 3. Anima i box immagine
      tl.to(`.image_box.is--${fromStr}`, {
        scale: 0,
        opacity: 0,
        duration: duration,
        ease: "power2.inOut"
      }, 0);
      
      tl.fromTo(`.image_box.is--${toStr}`, {
        scale: 0,
        opacity: 0
      }, {
        scale: 1,
        opacity: 1,
        duration: duration,
        ease: "power2.inOut"
      }, 0.1);
      
      // 4. Anima i paragrafi
      tl.to(`.product_paragraph.is--${fromStr}`, {
        opacity: 0,
        y: direction > 0 ? -30 : 30,
        filter: 'blur(10px)',
        duration: duration,
        ease: "power2.inOut"
      }, 0.2);
      
      tl.fromTo(`.product_paragraph.is--${toStr}`, {
        opacity: 0,
        y: direction > 0 ? 30 : -30,
        filter: 'blur(10px)'
      }, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: duration,
        ease: "power2.inOut"
      }, 0.3);
      
      // 5. Aggiorna il link del pulsante dinamico
      if (dynamicButton) {
        dynamicButton.href = buttonUrls[toIndex];
      }
      
      return tl;
    }
    
    // Prepara tutti gli elementi per la slide corrente all'inizio
    function resetSlideState(currentIdx) {
      for (let i = 1; i <= totalSlides; i++) {
        const iStr = i < 10 ? `0${i}` : i;
        
        if (i === currentIdx + 1) {
          // Elementi visibili per la slide corrente
          gsap.set(`.product_title.is--${iStr}`, { y: 0 });
          gsap.set(`.product_sub.is--${iStr}`, { opacity: 1, filter: 'blur(0px)' });
          gsap.set(`.image_box.is--${iStr}`, { scale: 1, opacity: 1 });
          gsap.set(`.product_paragraph.is--${iStr}`, { opacity: 1, y: 0, filter: 'blur(0px)' });
        } else {
          // Elementi nascosti per le altre slide
          // Posiziona in modo diverso a seconda che siano "prima" o "dopo" la slide corrente
          if (i < currentIdx + 1) {
            gsap.set(`.product_title.is--${iStr}`, { y: -100 });
            gsap.set(`.product_paragraph.is--${iStr}`, { opacity: 0, y: -30, filter: 'blur(10px)' });
          } else {
            gsap.set(`.product_title.is--${iStr}`, { y: 100 });
            gsap.set(`.product_paragraph.is--${iStr}`, { opacity: 0, y: 30, filter: 'blur(10px)' });
          }
          
          gsap.set(`.product_sub.is--${iStr}`, { opacity: 0, filter: 'blur(10px)' });
          gsap.set(`.image_box.is--${iStr}`, { scale: 0, opacity: 0 });
        }
      }
    }
    
    // Gestione dei pulsanti e navigazione
    const nextButton = document.getElementById('next');
    const prevButton = document.getElementById('prev');
    
    // Funzione per passare alla slide successiva
    function goToNextSlide() {
      if (isAnimating || imagesLoaded < imageUrls.length) return;
      
      const fromIndex = currentIndex;
      nextIndex = (currentIndex + 1) % totalSlides;
      
      // Imposta le texture per la transizione WebGL
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, textures[currentIndex]);
      gl.uniform1i(u_fromLoc, 0);
      
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, textures[nextIndex]);
      gl.uniform1i(u_toLoc, 1);
      
      // Avvia transizione WebGL
      animateTransition();
      
      // Avvia animazioni UI con GSAP
      animateToSlide(fromIndex, nextIndex, 1);
    }
    
    // Funzione per passare alla slide precedente
    function goToPrevSlide() {
      if (isAnimating || imagesLoaded < imageUrls.length) return;
      
      const fromIndex = currentIndex;
      nextIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      
      // Imposta le texture per la transizione WebGL
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, textures[currentIndex]);
      gl.uniform1i(u_fromLoc, 0);
      
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, textures[nextIndex]);
      gl.uniform1i(u_toLoc, 1);
      
      // Avvia transizione WebGL
      animateTransition();
      
      // Avvia animazioni UI con GSAP
      animateToSlide(fromIndex, nextIndex, -1);
    }
    
    // Collega gli event listener ai pulsanti
    if (nextButton) {
      nextButton.addEventListener('click', goToNextSlide);
    }
    
    if (prevButton) {
      prevButton.addEventListener('click', goToPrevSlide);
    }
    
    // Controlla se tutti gli elementi necessari esistono (per debug)
    function checkElements() {
      for (let i = 1; i <= totalSlides; i++) {
        const iStr = i < 10 ? `0${i}` : i;
        
        if (!document.querySelector(`.product_title.is--${iStr}`)) {
          console.warn(`Elemento .product_title.is--${iStr} non trovato`);
        }
        
        if (!document.querySelector(`.product_sub.is--${iStr}`)) {
          console.warn(`Elemento .product_sub.is--${iStr} non trovato`);
        }
        
        if (!document.querySelector(`.image_box.is--${iStr}`)) {
          console.warn(`Elemento .image_box.is--${iStr} non trovato`);
        }
        
        if (!document.querySelector(`.product_paragraph.is--${iStr}`)) {
          console.warn(`Elemento .product_paragraph.is--${iStr} non trovato`);
        }
      }
      
      if (!dynamicButton) {
        console.warn('Elemento #dinamic-button non trovato');
      }
    }
    
    // Esegui il controllo degli elementi (commentare/rimuovere in produzione)
    setTimeout(checkElements, 2000);
  });
})();
