import _ from 'lodash/fp';
import React, { Component, Fragment, SFC } from 'react';
import { Redirect, Route, RouteComponentProps, withRouter } from 'react-router-dom';

import { Project, Table } from 'src/client/components';
import { ICryptoAsset, ViewName, ViewType } from 'src/client/interfaces';
import { connect } from 'src/client/store';
import { IAppState } from 'src/client/store/app';

type CoinsProps = IAppState & RouteComponentProps<{}>;

export class Coins extends Component<CoinsProps> {
  static toExactPath = () => <Redirect to="/coins" />;

  goToProjectView = (event, project: ICryptoAsset) => {
    const coinId = _.kebabCase(project.name); // TODO: formalize

    this.props.history.push(`/coins/${coinId}`, {
      view: {
        name: ViewName.Coins,
        type: ViewType.Project,
        config: {
          data: project
        }
      }
    });
  }

  ProjectView = () => {
    const { state } = this.props.location;

    if (_.isEmpty(this.props.location.state)) return Coins.toExactPath();

    const coin: ICryptoAsset = state.view.config.data;

    return coin && (
      <Project
        {...coin}
        website={coin.officialWebsite}
      />
    );
  }

  TableView: SFC = () => (
    <Table
      data={this.props.coins}
      loading={this.props.loading}
      onRowClick={this.goToProjectView}
    />
  )

  render() {
    const { ProjectView, TableView } = this;
    const { match } = this.props;

    return (
      <Fragment>
        <Route exact={true} path={match.path} component={TableView} />
        <Route path={`${match.path}/:coinId`} render={ProjectView} />
      </Fragment>
    );
  }
}

const ConnectedCoins = connect(store => store.app)(Coins);

export default withRouter(ConnectedCoins) as typeof ConnectedCoins & Pick<typeof Coins, 'toExactPath'>;
