<?php

class Plano_VinculosController extends Zend_Controller_Action
{

    public function init()
    {
        $this->getResponse()
             ->setHeader('Content-type', 'text/javascript');
        $swContext = $this->_helper->contextSwitch();
        $swContext->setAutoJsonSerialization(true);
        $swContext->addContext('js', array('suffix' => 'js'))
                        ->addActionContext('Controller', array( 'js'))
                        ->addActionContext('List', array( 'js'))
                        ->addActionContext('Edit', array('js'))
                        ->initContext('js');
        $this->_helper->layout()->disableLayout();
    }

    public function controllerAction()
    {
    }

    public function listAction()
    {
    }

    public function editAction()
    {
    }


}

