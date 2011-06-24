<?php

/**
 * @author Marcone Costa <blog@marconecosta.com.br>
 * @link www.barraetc.com.br/blogpress
 */
class Data_UsuariosController extends Zend_Rest_Controller {

    public function init() {
        $swContext = $this->_helper->contextSwitch();
        $swContext->setAutoJsonSerialization(true);
        $swContext->addActionContext('index', array('json', 'xml'))
                ->addActionContext('put', array('json', 'xml'))
                ->addActionContext('post', array('json', 'xml'))
                ->addActionContext('get', array('json', 'xml'))
                ->addActionContext('delete', array('json', 'xml'))
                ->initContext('json');
        $this->_helper->layout()->disableLayout();
        $this->_helper->viewRenderer->setNoRender(true);
    }

    public function indexAction() {
        $usuarios_table = new Data_Model_DbTable_Usuarios();
        $usuarios = $usuarios_table->fetchAll(null, 'id');
        $this->_helper->viewRenderer->setNoRender(true);
        $arr = array('rows' => $usuarios->toArray(), 'total' => count($usuarios));
        $this->view->rows = $usuarios->toArray();
        $this->view->total = count($usuarios);
    }

    public function getAction() {
        $usuarios_table = new Data_Model_Usuarios();
        $usuario = $usuarios_table->getUsuario($this->_getParam('id')) ;
        $this->view->rows = $usuario->toArray();
        $this->view->total = count($usuario);
    }

    public function postAction() {
        if ($this->getRequest()->isPost()) {
            try {

                $usuarios_table = new Data_Model_Usuarios();
                $formData = $this->getRequest()->getPost('rows');
                $formData = json_decode($formData, true);
                unset($formData['id']);
                $obj = $usuarios_table->addUsuario($formData);
                $this->view->msg = "Dados inseridos com sucesso!";
                $this->view->rows = $obj->toArray();
                $this->view->success = true;
            } catch (Exception $e) {
                $this->view->success = false;
                $this->view->method = $this->getRequest()->getMethod();
                $this->view->msg = "Erro ao inserir registro<br>" . $e->getMessage() . "<br>" . $e->getTraceAsString();
            }
        } else {
            $this->view->msg = "Método " . $this->getRequest()->getMethod();
        }
    }

    public function putAction() {
        if (($this->getRequest()->isPut())) {
            try {
                $usuarios_table = new Data_Model_Usuarios();
                $formData = $this->getRequest()->getParam('rows');
                $formData = json_decode($formData, true);
                $id = $formData['id'];
                unset($formData['id']);
                $obj = $usuarios_table->updateUsuario($formData, "id=$id");
                $this->view->msg = "Dados atualizados com sucesso!";
                
                $this->view->rows = $obj->toArray();
                $this->view->success = true;
            } catch (Exception $e) {
                $this->view->success = false;
                $this->view->method = $this->getRequest()->getMethod();
                $this->view->msg = "Erro ao atualizar registro<br>" . $e->getMessage() . "<br>" . $e->getTraceAsString();
            }
        } else {
            $this->view->msg = "Método " . $this->getRequest()->getMethod();
        }
    }

    public function deleteAction() {
        if ($this->getRequest()->isDelete()) {
            try {
                $usuarios_table = new Data_Model_Usuarios();
                $id = $this->_getParam('id');
                $usuarios_table->deleteUsuario($id);
                $this->view->success = true;
                $this->view->msg = "Dados apagados com sucesso!";
            } catch (Exception $e) {
                $this->view->success = false;
                $this->view->msg = "Erro ao apagar o registro<br>" . $e->getTraceAsString();
            }
        } else {
            $this->view->msg = "Método ". $this->getRequest()->getMethod();;
            $this->view->parametros = $this->_getAllParams();
        }
    }

}

