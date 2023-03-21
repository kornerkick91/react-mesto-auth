import { CurrentUserContext } from '../contexts/CurrentUserContext';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ImagePopup from './ImagePopup';
import ConfirmDeletePopup from './ConfirmDeletePopup';
import { useState, useEffect } from 'react';
import { api } from '../utils/api';

function App() {
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isConfirmDeletePopupOpen, setIsConfirmDeletePopupOpen] = useState(false);
  const [imagePopupCard, setImagePopupCard] = useState({});
  const [deletingCard, setDeletingCard] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    Promise.all([api.getProfile(), api.getCards()])
      .then(([user, cards]) => {
        setCurrentUser(user);
        setCards(cards);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  };

  const handleCardClick = (data) => {
    setImagePopupCard(data);
  };

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsConfirmDeletePopupOpen(false);
    setImagePopupCard({});
  };

  const handleCloseByEsc = (e) => {
    if (e.key === 'Escape') {
      closeAllPopups();
    }
  };

  const handleCloseByClickOnOverlay = (e) => {
    if (e.target.classList.contains('popup_opened')) {
      closeAllPopups();
    }
  };

  useEffect(() => {
    if (isEditAvatarPopupOpen || isEditProfilePopupOpen || isAddPlacePopupOpen || isConfirmDeletePopupOpen || imagePopupCard) {
      document.addEventListener('keydown', handleCloseByEsc);
      document.addEventListener('mousedown', handleCloseByClickOnOverlay);
    }

    return () => {
      document.removeEventListener('keydown', handleCloseByEsc);
      document.removeEventListener('mousedown', handleCloseByClickOnOverlay);
    };
  }, [isEditAvatarPopupOpen, isEditProfilePopupOpen, isAddPlacePopupOpen, isConfirmDeletePopupOpen, imagePopupCard]);

  const handleCardLike = (card) => {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        const newCards = cards.map((c) => (c._id === card._id ? newCard : c));
        setCards(newCards);
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteButtonClick = (card) => {
    setDeletingCard(card);
    setIsConfirmDeletePopupOpen(true);
  };

  const handleCardDelete = (card) => {
    api.deleteElement(card._id)
      .then(() => {
        const newCards = cards.filter((c) => c._id !== card._id);
        setCards(newCards);
      })
      .then(() => closeAllPopups())
      .catch((err) => console.log(err));
  };

  const handleUpdateUser = (user) => {
    setIsLoading(true);
    api.editProfile(user)
      .then(() => {
        setCurrentUser({ ...currentUser, name: user.name, about: user.about });
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };

  const handleUpdateAvatar = (avatar) => {
    setIsLoading(true);
    api.editAvatar(avatar)
      .then((user) => {
        setCurrentUser(user);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };

  const handleAddPlaceSubmit = (card) => {
    setIsLoading(true);
    api.addElement(card)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };

  return (
    <div>
      <CurrentUserContext.Provider value={{currentUser}}>
        <Header />
        <Main onEditProfile={handleEditProfileClick} onAddPlace={handleAddPlaceClick} onEditAvatar={handleEditAvatarClick} onCardClick={handleCardClick} cards={cards} onCardLike={handleCardLike} onDeleteButtonClick={handleDeleteButtonClick} onCardDelete={handleCardDelete} />
        <Footer />
        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} isLoading={isLoading} />
        <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} isLoading={isLoading} />
        <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} isLoading={isLoading} />
        <ConfirmDeletePopup isOpen={isConfirmDeletePopupOpen} onClose={closeAllPopups} onCardDelete={handleCardDelete} card={deletingCard} />
        <ImagePopup card={imagePopupCard} onClose={closeAllPopups} />
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;