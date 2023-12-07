const User = require('../models/User');
//const secret = require('../config/auth.json');
const bcript = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config()


const createUser = async (req, res) => {
    const { name, email, password } = req.body;
    const newPassword = await bcript.hash(password, 11)
    await User.create({
        name: name,
        email: email,
        password: newPassword

    }).then(() => {
        res.json('Usuário criado com sucesso!');
        console.log('Usuário criado com sucesso!');
    }).catch((erro) => {
        res.json('Erro ao criar usuário.');
        console.log(`Erro ao criar usuário: ${erro}`);
    })
}


const findUsers = async (req, res) => {
    const users = await User.findAll();
    try {
        res.json(users);
    } catch (error) {
        res.status(404).json("Ocorreu um erro na busca!");
    };
}


const deleteUser = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        await User.destroy({
            where: {
                id: id
            }
        }).then(() => {
            res.json("Usuário deletado com sucesso!");
        })
    } catch (error) {
        res.status(404).json("Erro ao deletar usuário.");
    }
}

const updateUser = async (req, res) => {
    const id = parseInt(req.params.id);
    const { name, email, password } = req.body;
    try {
        const newpassword = await bcript.hash(password, 11);
        await User.update(
            {
                name: name,
                email: email,
                password: newpassword
            },
            {
                where: {
                    id: id
                }
            }
        ).then(() => {
            res.json("Usuário atualizado com sucesso!");
        })
    } catch (error) {
        res.status(404).json("Erro ao atualizar usuário!");
    }
}

const authenticatedUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const isUserAuthenticated = await User.findOne({
            where: { 
                email: email,
            }
        })
        if(!isUserAuthenticated) {
            return res.status(401).send('email ou senha errados');
        }
        const response = await bcript.compare(password, isUserAuthenticated.password);
        if(response === true){
            const token = jwt.sign({
                name: isUserAuthenticated.name,
                email: isUserAuthenticated.email
            },
                process.env.SECRET, {
                expiresIn: 86400,
            })
        
            res.cookie('token', token, { httpOnly: true }).json({
                name: isUserAuthenticated.name,
                email: isUserAuthenticated.email,
                token: token
            });
        }
    }
    catch (error) {
        console.error(`Error: ${error}`)
        res.status(500).json({ message: 'Error occurred during authentication'})
    }
}
module.exports = { createUser, findUsers, deleteUser, updateUser, authenticatedUser };