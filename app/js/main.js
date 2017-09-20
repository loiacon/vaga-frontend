// Amex usa 4 dígitos CVV/CVC
var isamex = false;

// Trocar selecionado ao clicar em cartão
$('.trigger').click(function () {
  if ($(this).is('#mastercard')) {
    $('#card-type').text('Mastercard');
    isamex = false;
  } else if ($(this).is('#visa')) {
    $('#card-type').text('Visa');
    isamex = false;
  } else if ($(this).is('#elo')) {
    $('#card-type').text('Elo');
    isamex = false;
  } else if ($(this).is('#diners_club')) {
    $('#card-type').text('Diners Club');
    isamex = false;
  } else if ($(this).is('#amex')) {
    $('#card-type').text("American Express");
    isamex = true;
  }
  if (isamex) {
    $('#cvv').prop({
      'placeholder': '1234',
      'maxlength': 4
    });
  } else if (!isamex) {
    $('#cvv').prop({
      'placeholder': '123',
      'maxlength': 3
    });
  }
  $('.cvv').cvv();
});

// Resetar formulário no botão de resetar formulário
$('.reset').click(function (e) {
  e.preventDefault();
  $('#main-form')[0].reset();
  $('.card-number, .cvv, .card-number-2, #validadeMes, #validadeAno, #titular').removeClass('rejected');
  $('.error-icon').remove();
  $('.card-number, .cvv, .card-number-2, #validadeMes, #validadeAno').removeClass('accepted');
});

// Limitar input à números
$(document).ready(function () {
  $(".card-number, .cvv, .card-number-2").keydown(function (e) {
    // Permite: espaço, delete, tab, esc, enter e .
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190, 32]) !== -1 ||
      // Permite: Ctrl+A, Cmd+A
      (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
      // Permite: home, end, esquerda, direita, baixo, cima
      (e.keyCode >= 35 && e.keyCode <= 40)) {
      return;
    }
    // Se não for um número, previne de clicar
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  });

  $('#titular').keydown(function (e) { // Mesma coisa do de cima
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190, 32]) !== -1 ||
      (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
      (e.keyCode >= 35 && e.keyCode <= 40)) {
      return;
    } // Porém aqui previne números, apenas letras podem passar
    if ((e.keyCode < 65 || e.keyCode > 90) && (e.keyCode < 112 || e.keyCode > 8000)) {
      e.preventDefault();
    }
  });
});

// Pega toda vez que o nome do titular passa
$('#titular').keyup(function () { 
  var cardLenght = $(this).val().length;
  if (cardLenght >= 1) {
    $(this).removeClass('rejected');
    $(this).addClass('accepted-bg');
  } else {
    $(this).removeClass('accepted-bg');
  }
});

// Foi selecionado? Adiciona classe e aceita
$('#validadeMes, #validadeAno').click(function () { 
  var cardLenght = $(this).val();
  if (cardLenght != null) {
    $(this).removeClass('rejected');
    $(this).addClass('accepted');
  }
});

// Trocar automaticamente de input ao chegar no máximo de caracteres
$('.card-number').keyup(function () {
  var card_number = '';
  $('.card-number').each(function (e) {
    $(this).keyup(function (e) {
      if (e.keyCode == 8) {
        if ($(this).val().length == 0) {
          $(this).prev().focus();
        }
      }
    });
    card_number += $(this).val() + ' ';
    if ($(this).val().length == 4) {
      $(this).next().focus();
    }
  });
});

// Função de aceitação e rejeição do número do cartão
(function () {
  var errorIcon = '<i class="error-icon"></i>';
  $('.card-number').keyup(function () {
    var cardLength = $(this).val().length;
    var objLenght = 4;
    if (cardLength < objLenght && $(this).next().hasClass('error-icon') == false) {
      $(this).addClass('rejected');
      $(this).removeClass('accepted');
      $('.rejected').after(errorIcon);
    } else if (cardLength == objLenght) {
      $('i.error-icon').remove();
      $(this).removeClass('rejected');
      $(this).addClass('accepted');
      $(this).next().focus();
    } else if (cardLength == 0) {
      $('i.error-icon').remove();
      $(this).removeClass('rejected');
    }
  });
})();

// Função cvv()
(function () {
  var click = true; // Para não criar 12093812 ícones de erro
  $.fn.cvv = function () {
    var cardLength = $(this).val().length;
    var objLenght;
    // Se for amex, só aceitará 4 dígitos CVV
    if (isamex) {
      objLenght = 4;
    } else {
      objLenght = 3;
    }
    if (cardLength != objLenght && click == true && cardLength > 0) {
      $(this).addClass('rejected');
      $('.rejected').after('<i class="error-icon"></i>');
      $(this).removeClass('accepted');
      click = false; // Adiciona o ícone 1x e o click fica falso, impedindo de criar mais
    } else if (cardLength == objLenght) {
      $('i.error-icon').remove();
      $(this).removeClass('rejected');
      $(this).next().focus();
      $(this).addClass('accepted');
      click = true;
    } else if (cardLength == 0) {
      $('i.error-icon').remove();
      $(this).removeClass('rejected');
    }
  }
})(jQuery);

$('.cvv').keyup(function () { // Aciona a função quando o usuário clica
  $(this).cvv();
});

// Input no mobile
(function () {
  var click = true;
  $('.card-number-2').keyup(function () {
    var cardLength = $(this).val().replace(/\s+/g, '').length;
    var objLenght = 16;
    if (cardLength < objLenght && click == true) {
      $(this).addClass('rejected');
      $('.rejected').after('<i class="error-icon-mob"></i>');
      $('.error-icon-mob').text(objLenght - cardLength);
      $(this).removeClass('accepted');
      click = false;
    } else if (cardLength < objLenght && click == false) {
      $('.error-icon-mob').text(objLenght - cardLength);
    } else {
      $('i.error-icon-mob').remove();
      $(this).removeClass('rejected');
      $(this).addClass('accepted');
      $(this).next().focus();
      click = true;
    }
  });
})();

// Botão do Modal - Apenas da reload na página :p
$('.modal-wrapper--btn').click(function(e) {
  e.preventDefault();
  location.reload();
});


$(document).ready(function () {
  $('.card-number-2').mask('0000 0000 0000 0000'); // Mascará do jQuery Mask para o número mobile
  $('input').prop('required', true); // Todo input é required
  $('select').prop('required', true); // Todo select é required

  var nomeTitular = $('#titular'), // Variáveis gerais do formulário
      nc1 = $('#nc1'),
      nc2 = $('#nc2'),
      nc3 = $('#nc3'),
      nc4 = $('#nc4'),
      ncMobile = $('#ncmob'),
      validadeMes = $('#validadeMes'),
      validadeAno = $('#validadeAno'),
      cvv = $("#cvv");

  $('.btn').click(function (e) { // Quando o botão principal for clicado
    var nc = nc1.val() + ' ' + nc2.val() + ' ' + nc3.val() + ' ' + nc4.val(),
        ncLenght = nc.length,
        ncMob = ncMobile.val(),
        ncMobLenght = ncMob.length,
        titular = nomeTitular.val(),
        validade = validadeMes.val() + '/' + validadeAno.val(),
        cvc = cvv.val(),
        cvcLenght = cvc.length,
        loader = $('.loader-bg');
    
    e.preventDefault();
    
    if (!nc1.val()) { // Cada input revisado um por um
      $(nc1).addClass('rejected');
    }
    if (!nc2.val()) {
      $(nc2).addClass('rejected');
    }
    if (!nc3.val()) {
      $(nc3).addClass('rejected');
    }
    if (!nc4.val()) {
      $(nc4).addClass('rejected');
    }
    if (!titular) {
      $(nomeTitular).addClass('rejected');
    }
    if (validadeMes.val() == null) {
      $(validadeMes).addClass('rejected');
    }
    if (validadeAno.val() == null) {
      $(validadeAno).addClass('rejected');
    }
    if (!cvc) {
      $(cvv).addClass('rejected');
    }
    if (ncLenght == 19 && titular && validade && cvcLenght == 3 && isamex == false ||
      ncMobLenght == 19 && titular && validade && cvcLenght == 3 && isamex == false ||
      ncLenght == 19 && titular && validade && cvcLenght == 4 && isamex == true ||
      ncMobLenght == 19 && titular && validade && cvcLenght == 4 && isamex == true) {
      loader.addClass('loader-active');
      setTimeout(function () { // Timeout só pelo suspense
        loader.removeClass('loader-active');
        $('.modal').addClass('modal-active');
      }, 6000);
    }
  });
});
