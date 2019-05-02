import { call, put, select, takeLatest } from 'redux-saga/effects';
import history from '../../history';
import { updateObject } from '../../helpers/utils';
import * as selectors from '../selectors/user';
import quote from './apis/quote';
import part from './apis/part';

import {
  ARCHIVE_QUOTE,
  archiveQuoteError,
  archiveQuoteOK,
  COPY_QUOTE,
  copyQuoteError,
  copyQuoteOK,
  CREATE_QUOTE,
  createQuoteError,
  createQuoteOK,
  DELETE_QUOTE_PART,
  deleteQuotePartError,
  deleteQuotePartOK,
  FIND_QUOTES,
  GET_QUOTE,
  GET_QUOTE_TO_COPY,
  getQuoteError,
  getQuoteListError,
  getQuoteListOK,
  getQuoteOK,
  getQuoteToCopyError,
  getQuoteToCopyOK,
  ISSUE_QUOTE,
  issueQuoteError,
  issueQuoteOK,
  SAVE_QUOTE_PART,
  saveQuoteError,
  saveQuoteOK,
  saveQuotePartError,
  saveQuotePartOK,
  UNARCHIVE_QUOTE,
  unarchiveQuoteError,
  unarchiveQuoteOK,
  UPDATE_QUOTE,
} from '../actions/quote';
import { errorAsMessage, logError } from '../../helpers/api_error';

import { getCustomer } from '../actions/customer';
import { savePartOK } from '../actions/part';
import { getModelKey } from '../../components/app/model/helpers/model';

export function* saveQuoteProcess(action) {
  const quoteToSave = action.payload.quote;
  try {
    const token = yield select(selectors.token);
    if (token) {
      const completePayload = { quote: quoteToSave, token };
      const response = yield call(quote.saveQuote, completePayload);
      yield put(saveQuoteOK(response.data));
    } else {
      yield call(history.push, '/login');
    }
  } catch (apiError) {
    const error = 'Save Quote failed';
    let error_detail;
    logError(apiError);
    if (apiError.response) {
      error_detail = apiError.response.data;
    }
    yield put(saveQuoteError({ quoteToSave, error, error_detail }));
  }
}

export function* watchForSaveQuote() {
  yield takeLatest(`${UPDATE_QUOTE}_REQUESTED`, saveQuoteProcess);
}

export function* archiveQuote(action) {
  try {
    const token = yield select(selectors.token);
    if (token) {
      const completePayload = updateObject(action.payload, { token });
      const response = yield call(quote.archiveQuote, completePayload);
      yield put(archiveQuoteOK(response.data));
    } else {
      yield call(history.push, '/login');
    }
  } catch (error) {
    yield put(archiveQuoteError(errorAsMessage(error, 'Archive Quote failed')));
  }
}

export function* watchForArchiveQuote() {
  yield takeLatest(`${ARCHIVE_QUOTE}_REQUESTED`, archiveQuote);
}

export function* unarchiveQuote(action) {
  try {
    const token = yield select(selectors.token);
    if (token) {
      const completePayload = updateObject(action.payload, { token });
      const response = yield call(quote.unarchiveQuote, completePayload);
      yield put(unarchiveQuoteOK(response.data));
    } else {
      yield call(history.push, '/login');
    }
  } catch (error) {
    yield put(unarchiveQuoteError(errorAsMessage(error, 'Quote restore failed')));
  }
}

export function* watchForUnarchiveQuote() {
  yield takeLatest(`${UNARCHIVE_QUOTE}_REQUESTED`, unarchiveQuote);
}

export function* copyQuote(action) {
  try {
    const token = yield select(selectors.token);
    if (token) {
      const completePayload = updateObject(action.payload, { token });
      const response = yield call(quote.copyQuote, completePayload);
      yield put(copyQuoteOK(response.data));
      yield put(getCustomer(response.data.customerId));
      yield call(history.push, '/quote');
    } else {
      yield call(history.push, '/login');
    }
  } catch (error) {
    yield put(copyQuoteError(errorAsMessage(error, 'Copy Quote failed')));
  }
}

export function* watchForCopyQuote() {
  yield takeLatest(`${COPY_QUOTE}_REQUESTED`, copyQuote);
}

export function* getQuote(action) {
  try {
    const token = yield select(selectors.token);
    if (token) {
      const completePayload = updateObject(action.payload, { token });
      const response = yield call(quote.getQuote, completePayload);
      yield put(getQuoteOK(response.data));
      yield put(getCustomer(response.data.customerId));
      yield call(history.push, '/quote');
    } else {
      yield call(history.push, '/login');
    }
  } catch (error) {
    yield put(getQuoteError(errorAsMessage(error, 'Failed to get quote')));
  }
}

export function* watchForGetQuote() {
  yield takeLatest(`${GET_QUOTE}_REQUESTED`, getQuote);
}
export function* getQuoteToCopy(action) {
  try {
    const token = yield select(selectors.token);
    if (token) {
      const completePayload = updateObject(action.payload, { token });
      const response = yield call(quote.getQuote, completePayload);
      yield put(getQuoteToCopyOK(response.data));
      yield call(history.push, '/quote-copy');
    } else {
      yield call(history.push, '/login');
    }
  } catch (error) {
    yield put(getQuoteToCopyError(errorAsMessage(error, 'Failed to get quote')));
  }
}

export function* watchForGetQuoteToCopy() {
  yield takeLatest(`${GET_QUOTE_TO_COPY}_REQUESTED`, getQuoteToCopy);
}

export function* getQuoteList(action) {
  try {
    const token = yield select(selectors.token);
    if (token) {
      const completePayload = updateObject(action.payload, { token });
      const response = yield call(quote.getQuoteList, completePayload);
      yield put(getQuoteListOK(response.data));
    } else {
      yield call(history.push, '/login');
    }
  } catch (error) {
    yield put(getQuoteListError(errorAsMessage(error, 'Failed to get quotes')));
  }
}

export function* watchForGetQuoteList() {
  yield takeLatest(`${FIND_QUOTES}_REQUESTED`, getQuoteList);
}

export function* createQuote(action) {
  try {
    const token = yield select(selectors.token);
    if (token) {
      const completePayload = updateObject(action.payload, { token });
      const response = yield call(quote.createQuote, completePayload);
      yield put(createQuoteOK(response.data));
      yield put(getCustomer(response.data.customerId));
      yield call(history.push, '/quote');
    } else {
      yield call(history.push, '/login');
    }
  } catch (error) {
    yield put(createQuoteError(errorAsMessage(error, 'Create Quote failed')));
  }
}

export function* watchForCreateQuote() {
  yield takeLatest(`${CREATE_QUOTE}_REQUESTED`, createQuote);
}

export function* saveQuotePart(action) {
  const quotePart = updateObject(action.payload.quotePart);
  const partToSave = action.payload.part;
  try {
    const token = yield select(selectors.token);
    if (token) {
      if (partToSave) {
        const partPayload = { part: partToSave, token };
        let partResponse;
        if (partToSave.id) {
          partResponse = yield call(part.savePart, partPayload);
        } else {
          partResponse = yield call(part.createPart, partPayload);
        }
        const savedPart = partResponse.data;
        quotePart.part = savedPart.id;
        yield put(savePartOK(partResponse.data));
      }
      const quotePartPayload = { quotePart, token };
      let response;
      if (quotePart.id) {
        response = yield call(quote.updateQuotePart, quotePartPayload);
      } else {
        response = yield call(quote.createQuotePart, quotePartPayload);
      }
      yield put(saveQuotePartOK(response.data, getModelKey(quotePart)));

      const quoteId = quotePart.quote;
      const quoteResponse = yield call(quote.recalculateQuote, { quoteId, token });
      yield put(getQuoteOK(quoteResponse.data));
    } else {
      yield call(history.push, '/login');
    }
  } catch (apiError) {
    const error = 'Quote Part save failed';
    let error_detail;
    logError(apiError);
    if (apiError.response) {
      error_detail = apiError.response.data;
    }
    yield put(saveQuotePartError({ quotePart, error, error_detail }));
  }
}

export function* watchForSaveQuotePart() {
  yield takeLatest(`${SAVE_QUOTE_PART}_REQUESTED`, saveQuotePart);
}

export function* deleteQuotePart(action) {
  try {
    const token = yield select(selectors.token);

    if (token) {
      const completePayload = updateObject(action.payload, { token });
      yield call(quote.deleteQuotePart, completePayload);
      yield put(deleteQuotePartOK(action.payload.quotePartId));

      const quoteId = action.payload.quoteId;
      const quoteResponse = yield call(quote.recalculateQuote, { quoteId, token });
      yield put(getQuoteOK(quoteResponse.data));
    } else {
      yield call(history.push, '/login');
    }
  } catch (error) {
    logError(error);
    yield put(deleteQuotePartError('Delete Quote Part failed'));
  }
}

export function* watchForDeleteQuotePart() {
  yield takeLatest(`${DELETE_QUOTE_PART}_REQUESTED`, deleteQuotePart);
}

export function* issueQuote(action) {
  try {
    const token = yield select(selectors.token);
    if (token) {
      const completePayload = updateObject(action.payload, { token });
      const response = yield call(quote.issueQuote, completePayload);
      yield put(issueQuoteOK(response.data));
    } else {
      yield call(history.push, '/login');
    }
  } catch (error) {
    yield put(issueQuoteError(errorAsMessage(error, 'Issue Quote failed')));
  }
}

export function* watchForIssueQuote() {
  yield takeLatest(`${ISSUE_QUOTE}_REQUESTED`, issueQuote);
}
