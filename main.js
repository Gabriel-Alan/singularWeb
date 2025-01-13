const slides = document.querySelector('.slides');
const slideCount = document.querySelectorAll('.slide').length;
const itemsPerView = 3; // Quantos itens aparecem por vez
let currentIndex = 0;
let rotationCount = 0; // Contador de rotações completas
const maxRotations = 4; // Número máximo de rotações permitidas

function goToNextSlide() {
  // Verifica se já atingiu o limite de rotações
  if (rotationCount >= maxRotations) {
    clearInterval(sliderInterval); // Para o carrossel
    return; // Sai da função
  }

  // Move para o próximo conjunto de slides
  currentIndex += itemsPerView;

  // Se ultrapassar o total de slides, reseta para o começo e conta uma rotação
  if (currentIndex >= slideCount) {
    currentIndex = 0;
    rotationCount++;
  }

  // Atualiza a posição do carrossel
  slides.style.transform = `translateX(-${currentIndex * (100 / itemsPerView)}%)`;
}

// Configura o intervalo do carrossel
const sliderInterval = setInterval(goToNextSlide, 3000); // Troca a cada 3 segundos

function toggleTexto(element) {
const servico = element.parentElement; // Seleciona o contêiner pai
const descricao = servico.querySelector('.descricao'); // Seleciona a descrição

// Alterna a classe "open"
servico.classList.toggle('open');
}

document.getElementById('leadForm').addEventListener('submit', async function (event) {
event.preventDefault(); // Impede o redirecionamento da página

// Capturar os dados do formulário
const formData = new FormData(event.target);
const data = Object.fromEntries(formData.entries());

// Enviar os dados para o Apps Script via POST
const url = 'https://script.google.com/macros/s/AKfycbxPhUtxoEabShxy_ll7dknfGt8LMIbWnygqzBRjNkWSkGPz5n8PMjECbtEEgOLeXKbFVQ/exec'; // Substitua pelo URL do Apps Script
try {
  const response = await fetch(url, {
    method: 'POST',
    body: new URLSearchParams(data),
  });

  if (response.ok) {
    // Exibir o modal de sucesso
    document.getElementById('modal').classList.add('active');
    document.getElementById('overlay').classList.add('active');
    event.target.reset(); // Limpar o formulário
  } else {
    alert('Erro ao enviar os dados. Tente novamente.');
  }
} catch (error) {
  alert('Erro ao enviar os dados: ' + error.message);
}
});

// Fechar o modal
document.getElementById('closeModal').addEventListener('click', function () {
document.getElementById('modal').classList.remove('active');
document.getElementById('overlay').classList.remove('active');
});

// Função para verificar se um elemento está visível na janela
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top <= window.innerHeight &&
    rect.bottom >= 0
  );
}

// Adiciona a classe "visible" aos elementos visíveis
function handleScroll() {
  const elements = document.querySelectorAll('.animated-element');
  elements.forEach((el) => {
    if (isElementInViewport(el)) {
      el.classList.add('visible');
    }
  });
}

// Adiciona o evento de scroll
window.addEventListener('scroll', handleScroll);

// Executa a função ao carregar a página para animações iniciais
window.addEventListener('load', handleScroll);