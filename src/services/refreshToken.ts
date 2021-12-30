import axios from 'axios';
import ISessionData from '../models/sessioData';

export const getRefreshToken = () => axios.get<ISessionData>('/refreshToken');
