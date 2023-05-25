import React from 'react';
import '../index.css'
// импорт основных блоков
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
// импорт попапов
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
// импорт картинок
import ImagePopup from './ImagePopup';
// импорт компонентов
import { CurrentUserContext } from '../contexts/CurrentUserContext'
// импорт апи
import api from '../utils/Api'
// функциональный компонент
function App() {
  const [isEditProfilePopupOpen, setisEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setisAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setisEditAvatarPopupOpen] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState({ name: '', about: '', avatar: '' });
  const [selectedCard, setSelectedCard] = React.useState({ name: '', link: ''});
  const [cards, setCards] = React.useState([]);
  // функии для попапов
  function handleEditProfileClick() {
    setisEditProfilePopupOpen(true);
  }
  function handleAddPlaceClick() {
    setisAddPlacePopupOpen(true);
  }
  function handleEditAvatarClick() {
    setisEditAvatarPopupOpen(true);
  }
  function handleCardClick(card) {
    setSelectedCard({
      name: card.name,
      link: card.link,
    });
  }
  function closeAllPopups() {
    setisEditProfilePopupOpen(false);
    setisAddPlacePopupOpen(false);
    setisEditAvatarPopupOpen(false);
    setSelectedCard({ name: '', link: ''});
  }
  // функции для карточки
  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    // Отправляем запрос в API и получаем обновлённые данные карточки
    api.сhangeLikeCard(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function handleCardDelete(id) {
    console.log(id)
    api.removeCard(id)
      .then(() => {
        setCards((cards) => cards.filter((c) => c._id !== id));
      })
      .catch((err) => {
        console.log(err);
      });
  }
  // функции для редактирования данных
  function handleUpdateUser(newData) {
    console.log(newData);
    api.setUserInfo(newData)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      })
  }
  function handleUpdateAvatar(data) {
    api.setUserAvatar(data)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      });
  }
  function handleAddPlaceSubmit(card){
    api.addCard(card)
    .then((newCard) => {
      setCards([newCard, ...cards]);
      closeAllPopups();
    })
    .catch((err) => {
      console.log(`Ошибка: ${err}`);
    });
  }
  // хук эфекта с получением данных из апи
  React.useEffect(() => {
    api.getProfile()
      .then((data) => {
        setCurrentUser(data);
      })
      .catch((err) => {
        console.log(err);
      });
    api.getCardList()
      .then((data) => {
        setCards(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div className="page">
      <CurrentUserContext.Provider value={currentUser}>
        <Header />
        <Main
          onEditAvatar={handleEditAvatarClick}
          onEditProfile={handleEditProfileClick}
          onAddPlace={handleAddPlaceClick}
          onCardClick={handleCardClick}
          onCardLike={handleCardLike}
          onCardDelete={handleCardDelete}
          cards={cards}
        />
        <Footer />
        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />
        <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />
        <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} />
        <ImagePopup card={selectedCard} onClose={closeAllPopups}></ImagePopup>
      </CurrentUserContext.Provider>
    </div>
  );
}
export default App;
