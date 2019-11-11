import { generalRequest} from '../utilities';
import { url_ldap_ms, port_ldap_ms} from './server';

const URL_LOGIN = `http://${url_ldap_ms}:${port_ldap_ms}`;

var jwt = require('jsonwebtoken');

const crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';

function decrypt(text){
	var decipher = crypto.createDecipher(algorithm,password)
	var dec = decipher.update(text,'hex','utf8')
	dec += decipher.final('utf8');
	return dec;
}

const resolvers_login = {
	Query: {
		exists: async(_, {email}) => {
			let res = await generalRequest(`${URL_LOGIN}/exists`,'GET', email);
			if(res === true)
				return true;
			else
				return false;
			
		},
	},
	Mutation: {
		login: async (_, { credentials }) =>{
			
			let res = await	generalRequest(`${URL_LOGIN}/login`, 'POST', credentials)
			
			if(res === true) {
				var token = await jwt.sign({email: credentials.email}, 'ezibuy', {expiresIn: 60 * 60 * 24})
				return token;
			}
			else {
				return false; }
			
		}
	}
};

export default resolvers_login;