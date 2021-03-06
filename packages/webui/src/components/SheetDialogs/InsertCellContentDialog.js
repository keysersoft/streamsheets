/* eslint-disable react/forbid-prop-types */
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Button from '@material-ui/core/Button';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import JSG from '@cedalo/jsg-ui';

import * as Actions from '../../actions/actions';

import { graphManager } from '../../GraphManager';

const styles = {
	radioButton: {
		marginBottom: 10,
	},
};

/**
 * A modal dialog can only be closed by selecting one of the actions.
 */
export class InsertCellContentDialog extends React.Component {
	static propTypes = {
		open: PropTypes.bool.isRequired,
		stateHandler: PropTypes.func.isRequired,
	}

	constructor(props) {
		super(props);

		this.state = {
			open: props.open,
			type: 'all',
		};

		this.handleClose = this.handleClose.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ open: nextProps.open });
	}

	handleCancel = () => {
		this.props.stateHandler({ showInsertCellContentDialog: false });
		this.setState({ open: false });
	};

	handleClose = () => {
		this.setState({ open: false });
		this.props.stateHandler({ showInsertCellContentDialog: false });

		const sheetView = graphManager.getActiveSheetView();

		if (sheetView) {
			const selection = sheetView.getOwnSelection();
			if (selection.hasSelection()) {
				sheetView.pasteFromClipboard(
					graphManager.getGraphEditor().getGraphViewer(),
					selection.getAt(0).copy(),
					JSG.clipSheet.data,
					this.state.type,
				);
			}
		}
	};

	render() {
		return (
			<div>
				<Dialog
					open={this.state.open}
				>
					<DialogTitle>
						<FormattedMessage
							id="DialogInsert.title"
							defaultMessage="Insert Cell Content"
						/>
					</DialogTitle>
					<DialogContent
						style={{
							minWidth: '200px',
						}}
					>
						<RadioGroup
							name="type"
							value={this.state.type}
							onChange={(event, state) => { this.setState({ type: state }); }}
							style={{
								marginTop: '20px',
							}}
						>
							<FormControlLabel
								value="all"
								style={styles.radioButton}
								control={<Radio />}
								label={<FormattedMessage
									id="DialogInsert.complete"
									defaultMessage="Complete"
								/>}
							/>
							<FormControlLabel
								value="formulas"
								style={styles.radioButton}
								control={<Radio />}
								label={<FormattedMessage
									id="DialogInsert.formulas"
									defaultMessage="Formulas"
								/>}
							/>
							<FormControlLabel
								value="values"
								style={styles.radioButton}
								control={<Radio />}
								label={<FormattedMessage
									id="DialogInsert.values"
									defaultMessage="Values"
								/>}
							/>
							<FormControlLabel
								value="formats"
								style={styles.radioButton}
								control={<Radio />}
								label={<FormattedMessage
									id="DialogInsert.formats"
									defaultMessage="Formats"
								/>}
							/>
						</RadioGroup>
					</DialogContent>
					<DialogActions>
						<Button
							color="primary"
							onClick={this.handleCancel}
						>
							<FormattedMessage
								id="Cancel"
								defaultMessage="Cancel"
							/>
						</Button>
						<Button
							color="primary"
							onClick={this.handleClose}
							autoFocus
						>
							<FormattedMessage
								id="OK"
								defaultMessage="OK"
							/>
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(Actions, dispatch);
}

export default connect(null, mapDispatchToProps)(InsertCellContentDialog);
