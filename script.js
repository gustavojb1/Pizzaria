//criando uma variável para guardar o atributo data-key e conseguir acessa-lo ao clicar no botão adicionar ao carrinho pois o atributo data-key não fica acessível depois que abrir o modal da pizza escolhida
let modalKey = 0;
//Criando um array para o carrinho de compras
let cart = [];
//criando a variável modalQt que irá conter a quantidade de pizzas no modal(janela com detalhes da pizza[pizzaWindowArea]) com o valor inicial de 1
let modalQt = 1;
//função para substiruir querySelector por "c" e querySelectorAll por "cs"
const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);

//LISTAGEM DAS PIZZAS
pizzaJson.map((item, index) => {
  //fazendo clone da pizza-item
  let pizzaItem = c(".models .pizza-item").cloneNode(true);

  //setando um atributo "data-key" para usa-lo ao abrir o modal e preencher os dados da janela com a pizza selecionada
  pizzaItem.setAttribute("data-key", index);

  //setando os campos imagem, nome, descrição dentro da "pizza-item"
  pizzaItem.querySelector(".pizza-item--img img").src = item.img;
  pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name;
  pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description;
  pizzaItem.querySelector(
    ".pizza-item--price"
  ).innerHTML = `R$ ${item.price.toFixed(2)}`;

  //Cancelando evento de refresh da página ao clicar na pizza(preventDefault) e abrindo o modal(janela com detalhes da pizza[pizzaWindowArea])
  pizzaItem.querySelector("a").addEventListener("click", (e) => {
    e.preventDefault();
    //setando o atributo "data-key" a variavel "key"
    //closest pega o elemento mais proximo do a(link) que chama "pizza-item"
    let key = e.target.closest(".pizza-item").getAttribute("data-key");
    //setando a quantidade 1 ao modalQt sempre que abrir o modal da pizza
    modalQt = 1;
    //adicionando qual item foi escolhido(pela variavel key criada logo acima) a uma variável para eu conseguir acessá-la no modal(para quando eu clicar no adicionar ao carrinho)
    modalKey = key;

    //preenchendo os campos do modal(janela com descrição da pizza)
    c(".pizzaBig img").src = pizzaJson[key].img;
    c(".pizzaInfo h1").innerHTML = pizzaJson[key].name;
    c(".pizzaInfo--desc").innerHTML = pizzaJson[key].description;
    c(".pizzaInfo--actualPrice").innerHTML = `R$ ${pizzaJson[key].price.toFixed(
      2
    )}`;
    //remover a classe selected sempre que clicar em alguma pizza
    c(".pizzaInfo--size.selected").classList.remove("selected");
    //fazendo um forEach para percorrer o array gerado pelo querySelectorAll setando em cada span(dos tamanho pequena, media e grande)pegando o valor do objeto da pizza(pizzaJson[key].sizes[sizeIndex])
    cs(".pizzaInfo--size").forEach((size, sizeIndex) => {
      //irá adicionar a classe selected se o index do array gerado pelo querySelectorAll for 2(ou seja o tamanho grande)
      if (sizeIndex == 2) {
        size.classList.add("selected");
      }
      size.querySelector("span").innerHTML = pizzaJson[key].sizes[sizeIndex];
    });
    //irá setar o valor de modalQt(inicialmente será sempre 1) dentro da div que tem a classe pizzaInfo--qt
    c(".pizzaInfo--qt").innerHTML = modalQt;

    //setando opacidade para 0 antes de abrir para fazer o efeito de transição
    c(".pizzaWindowArea").style.opacity = 0;
    c(".pizzaWindowArea").style.display = "flex";
    //setando opacidade para 1 porem com uma espera para fazer o efeito de transição
    setTimeout(() => {
      c(".pizzaWindowArea").style.opacity = 1;
    }, 200);
  });

  //Adicionando pizzaItem na pizza-area (adicionando a quantidade de itens dentro do Json)
  //usa-se append pois quero adicionar cada item. Não usei innerHTML pois ele iria sobrescrever cada vez que o map passar para o outro item
  c(".pizza-area").append(pizzaItem);
});

//EVENTOS DO MODAL
//função para fechar o modal(versão para desktop e mobile)
function closeModal() {
  c(".pizzaWindowArea").style.opacity = 0;
  setTimeout(() => {
    c(".pizzaWindowArea").style.display = "none";
  }, 400);
}
cs(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton").forEach(
  (item) => {
    item.addEventListener("click", closeModal);
  }
);
//Adicionando evento de diminuir a quantidade se quantidade for maior que 1
c(".pizzaInfo--qtmenos").addEventListener("click", () => {
  if (modalQt > 1) {
    modalQt--;
  }
  c(".pizzaInfo--qt").innerHTML = modalQt;
});
//Adicionando evento de aumentar a quantidade
c(".pizzaInfo--qtmais").addEventListener("click", () => {
  modalQt++;
  c(".pizzaInfo--qt").innerHTML = modalQt;
});
//alterar o tamanho da pizza
cs(".pizzaInfo--size").forEach((size, sizeIndex) => {
  size.addEventListener("click", (e) => {
    c(".pizzaInfo--size.selected").classList.remove("selected");
    size.classList.add("selected");
  });
});

//evento de adicionar ao carrinho
c(".pizzaInfo--addButton").addEventListener("click", () => {
  // Qual a pizza? == modalKey (olhe na linha 1/2/35/36)
  // Quantas Pizzas == modalQt (olhe na linha 5/6)
  // Qual o tamanho? == size (setei na variavel size o valor "data-key"[que ja está setado no index, na div dos tamanhos] atraves da div que esta com a classe selected)
  let size = Number(c(".pizzaInfo--size.selected").getAttribute("data-key"));

  //Adicionando ao array cart a pizza selecionada
  //PORÉM precisa-se fazer uma verificação caso ja tenha a pizza escolhida no cart com o mesmo tamanho selecionado
  //criando um identificador para juntar a informação de qual é a pizza e o tamanho que foi adicionado no carrinho
  let identifier = pizzaJson[modalKey].id + "@" + size;

  //recebendo a posição(index) que está o identifier[pizza e o tamanho] igual ao que estamos adicionando ao cart (procura se tem o identificador[pizza e o tamanho] que estamos adicionando)
  let key = cart.findIndex((item) => {
    return item.identifier == identifier;
  });

  if (key > -1) {
    //aumentando a quantidade do item CASO ENCONTRE O MESMO IDENTIFICADOR DENTRO DO CARRINHO
    cart[key].qt += modalQt;
  } else {
    //Adicionando ao array cart a pizza selecionada CASO NÃO ENCONTRAR NENHUM IDENTIFICADOR IGUAL
    cart.push({
      identifier, // mesma coisa que "identifier:identifier"
      id: pizzaJson[modalKey].id,
      size, // mesma coisa que "size:size"
      qt: modalQt,
    });
  }
  updateCart();
  closeModal();
});
//adicionando evento ao clicar no botão do carrinho no MOBILE
c(".menu-openner").addEventListener("click", () => {
  if (cart.length > 0) {
    c("aside").style.left = "0";
  }
});
//adicionando evento de clicar no botão de fechar no MOBILE
c(".menu-closer").addEventListener("click", () => {
  c("aside").style.left = "100vw";
});

function updateCart() {
  //alterando a quantidade de itens no carrinho da versão MOBILE
  c(".menu-openner span").innerHTML = cart.length;

  if (cart.length > 0) {
    //mostrando o aside com meus itens
    c("aside").classList.add("show");
    //toda vez que rodar o update cart PRECISA-SE ZERAR E MOSTRAR A LISTA NOVAMENTE pois caso contrário irá adicionar sempre todos os itens novamente com o append
    c(".cart").innerHTML = "";
    //criando as variável do total/subtotal e desconto ANTES DO FOR DE ADICIONAR OS ITENS
    let subtotal = 0;
    let desconto = 0;
    let total = 0;

    //For usado para adicionar os itens do cart[] na div do carrinho utilizando o .models.cart--item
    for (let i in cart) {
      let pizzaItem = pizzaJson.find((item) => {
        return item.id == cart[i].id;
      });
      //adicionando o valor d cada item vezes a quantidade no subtotal
      subtotal += pizzaItem.price * cart[i].qt;
      // clonando o cart--item
      let cartItem = c(".models .cart--item").cloneNode(true);
      //preenchendo a imagem
      cartItem.querySelector("img").src = pizzaItem.img;
      //preenchendo o nome da pizza colocando o tamanho
      let pizzaSizeName;
      switch (cart[i].size) {
        case 0:
          pizzaSizeName = "P";
          break;
        case 1:
          pizzaSizeName = "M";
          break;
        case 2:
          pizzaSizeName = "G";
          break;
      }
      let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;
      cartItem.querySelector(".cart--item-nome").innerHTML = pizzaName;
      //preenchendo a quantidade de pizzas
      cartItem.querySelector(".cart--item--qt").innerHTML = cart[i].qt;
      //adicionando evento ao "+" e "-"(caso a quantidade for 1 e clicar no "-" vai remover o item do carrinho)
      cartItem
        .querySelector(".cart--item-qtmenos")
        .addEventListener("click", () => {
          if (cart[i].qt > 1) {
            cart[i].qt--;
          } else {
            cart.splice(i, 1);
          }
          updateCart();
        });
      cartItem
        .querySelector(".cart--item-qtmais")
        .addEventListener("click", () => {
          cart[i].qt++;
          updateCart();
        });

      c(".cart").append(cartItem);
    }
    //calculando desconto e total
    desconto = subtotal * 0.1;
    total = subtotal - desconto;
    //preenchendo os campos com os valores obtidos (pegando o ultimo span da div com classe "subtotal" = campo com o valor)
    c(".subtotal span:last-child").innerHTML = `R$ ${subtotal.toFixed(2)}`;
    c(".desconto span:last-child").innerHTML = `R$ ${desconto.toFixed(2)}`;
    c(".total span:last-child").innerHTML = `R$ ${total.toFixed(2)}`;
  } else {
    //fechando na versão DESKTOP
    c("aside").classList.remove("show");
    //fechando na versão MOBILE
    c("aside").style.left = "100vw";
  }
}
