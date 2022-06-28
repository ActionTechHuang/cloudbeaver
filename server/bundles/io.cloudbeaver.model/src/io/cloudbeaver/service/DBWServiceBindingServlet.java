/*
 * DBeaver - Universal Database Manager
 * Copyright (C) 2010-2022 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package io.cloudbeaver.service;

import io.cloudbeaver.model.app.WebApplication;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.jkiss.dbeaver.DBException;

/**
 * Servlet service
 */
public interface DBWServiceBindingServlet<APPLICATION extends WebApplication> extends DBWServiceBinding {

    void addServlets(APPLICATION application, ServletContextHandler servletContextHandler) throws DBException;
}