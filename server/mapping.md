# Recuperação de senha

**RF**

- O usuário deve poder recuperar a sua senha informando o seu e-mail;
- O usuário deve receber um e-mail com as instrunções de recuperação de senha;
- O usuário deve poder resetar a sua senha;

**RNF**

- Utilizar Mailtrap para testar envios em ambiente de dev;
- Utilizar Amazon SES para envios em produção;
- O envio de e-mails deve acontecer em segundo plano;

**RN**

- O Link enviado por email para restar senha, deve expirar em 2h;
- O usuário precisa confirmar a nova senha ao restar sua senha;

# Atualização de Perfil

**RF**

- O usuário deve poder atualizar seu perfil, nome, email e senha;

**RN**

- O usuário não pode alterar seu e-mail para um e-mail já utilizado;
- Para atualizar a sua senha, o usuário deve informar a sua senha antiga;
- Para atualizar a sua senha, o usuário precisa confirmar a nova senha;

# Painel do prestador

**RF**

- O usuário deve poder listar seus agendamentos de um dia específico;
- O prestador deve receber uma notificação sempre que houver um novo agendamento;
- O prestador deve poder visualizar as notificações não lidas;

**RNF**
- Os agendamentos do prestador no dia devem ser armazenados em cache;
- As notificações do prestador devem ser armazenadas no MongoDB(Banco não relacional);
- As notificações do prestador devem ser enviadas em tempo real utilizando o socket.io;

**RN**

- A notificação deve ter um status de lida ou não lida para que o prestador possa controlar;

# Agendamento de serviços

**RF**

- O usuário deve poder listar todos os prestadores de serviço cadastrados;
- O usuário deve poder listar os dias de 1 mês com pelo menos um horário disponível de um prestador
- O usuário deve poder listar horários disponíveis em um dia específico de um prestador;
- O usuário deve poder realizar um novo agendamento com um prestador;

**RNF**

- Listagem de prestadores deve ser armazenada em cache;

**RN**

- Cada agendamento deve durar 1h exatamente;
- Os agendamentos devem estar disponíveis entre 8h às 18h (Primeiro horário às 8h e último às 17h);
- O usuário não pode agendar em um horário já ocupado;
- O usuário não pode agendar em um horário que já passou;
- O usuário não pode agendar um horário consigo mesmo;
