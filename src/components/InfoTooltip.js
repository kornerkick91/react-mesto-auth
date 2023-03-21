import React from 'react';
import successImage from "../images/success.svg";
import errorImage from "../images/error.svg";

function InfoTooltip({ isOpen, onClose, err }) {
  return (
    <div className={`popup ${isOpen ? 'popup_opened' : ''}`}>
      <div className="popup__container">
        <button
          className="popup__close-button"
          type="button"
          onClick={onClose}
        ></button>
        <img
          className="popup__infotooltip-image"
          src={err ? errorImage : successImage}
          alt="Вы успешно зарегистрировались"
        />
        <p className="popup__infotooltip-text">
          {err
            ? "Что-то пошло не так! Попробуйте ещё раз."
            : "Вы успешно зарегистрировались!"}
        </p>
      </div>
    </div>
  );
}

export default InfoTooltip;
