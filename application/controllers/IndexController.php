<?php

class IndexController extends Zend_Controller_Action
{

    public function init()
    {
        /* Initialize action controller here */
    }

    public function indexAction()
    {
       
        $this->_auth = Zend_Auth::getInstance ();

        if ($this->_auth->hasIdentity ()) {

            $ident = $this->_auth->getIdentity();
            $this->view->usuario = $ident->usuario;
            $this->view->nomeUsuario = $ident->nome;
            if($ident->alterar_senha){
                $model_usuarios = new Data_Model_Usuarios();
                $usuario = $model_usuarios->getUsuario($ident->id);
                if ($usuario->alterar_senha){
                    $this->view->alterar_senha = $ident->alterar_senha;
                    $this->_helper->layout()->setLayout('acesso');
                }
            }
            if($ident->is_su){
            $this->view->adminMenu = "{
                    text: 'Administra&ccedil;&atilde;o',
                    id: 'btnAdministracao',
                    iconCls : 'icon-admin',
                    menu: [
                    {
                        text: 'Usuários',
                        data: 'admin.Users',
                        action: 'loadController',
                        createView : 'adminUsersList',
                        iconCls: 'icon-user'
                    },            
                    {
                        text        : 'Equipes',
                        iconCls     : 'icon-setores',
                        data        : 'admin.Setores',
                        action      : 'loadController',
                        createView  : 'adminSetoresList'
                    },{
                        text        : 'Arquivos',
                        iconCls     : 'icon-attach',
                        data        : 'plano.Anexos',
                        action      : 'loadController',
                        createView  : 'planoAnexosList'
                    },
                    {
                        text        : 'Estrutura',
                        iconCls     : 'icon-instrumentos',
                        data        : 'admin.Instrumentos',
                        action      : 'loadController',
                        createView  : 'adminInstrumentosList'
                    }

                    ]

                };";
            }else{
                $this->view->adminMenu = "{}";
            }
        }else{
            $this->_helper->layout()->setLayout('acesso');
        }
    }


}

