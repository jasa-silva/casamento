/**
 * RSVP — Casamento Jaqueline & Lucas
 * Recebe as confirmações do site, grava-as numa planilha do Google
 * e envia um e-mail de notificação aos noivos.
 *
 * COMO INSTALAR (passo a passo):
 *  1. Abra https://sheets.new  (cria uma planilha nova) e dê-lhe um nome,
 *     ex.: "RSVP — Jaqueline & Lucas".
 *  2. No menu, clique em  Extensões → Apps Script.
 *  3. Apague o código que aparecer e COLE todo este ficheiro. Guarde (💾).
 *  4. Clique em  Implementar (Deploy) → Nova implementação.
 *  5. No ícone de engrenagem, escolha  Aplicação Web (Web app).
 *       - Executar como:  Eu (a sua conta)
 *       - Quem tem acesso:  Qualquer pessoa (Anyone)
 *     Clique  Implementar  e autorize (Avançado → Aceder ao projeto → Permitir).
 *  6. Copie o  URL da aplicação web  (termina em  /exec ).
 *  7. Envie-me esse URL — eu coloco-o no site (CONFIG.rsvpEndpoint).
 */

var EMAIL_NOIVOS = 'jasasilva@outlook.pt';

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    // Cria o cabeçalho na primeira utilização
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Data/Hora', 'Nome', 'E-mail', 'Presença',
                       'Nº de Pessoas', 'Mensagem', 'Restrições']);
    }

    sheet.appendRow([new Date(), d.name, d.email, d.attend,
                     d.guests, d.message, d.diet]);

    var presenca = (d.attend === 'sim') ? 'VAI ESTAR PRESENTE ✅' : 'Não poderá ir 💔';
    MailApp.sendEmail({
      to: EMAIL_NOIVOS,
      subject: '💍 Nova confirmação: ' + d.name + ' — ' + presenca,
      body: 'Nome: ' + d.name +
            '\nE-mail: ' + (d.email || '—') +
            '\nPresença: ' + presenca +
            '\nNº de pessoas: ' + d.guests +
            '\nMensagem: ' + (d.message || '—') +
            '\nRestrições alimentares: ' + (d.diet || '—')
    });

    return ContentService.createTextOutput('ok');
  } catch (err) {
    return ContentService.createTextOutput('erro: ' + err);
  }
}
