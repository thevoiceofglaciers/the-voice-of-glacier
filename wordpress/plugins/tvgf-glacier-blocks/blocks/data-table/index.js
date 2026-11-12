( function ( blocks, element, blockEditor, components ) {
	var el = element.createElement;
	var registerBlockType = blocks.registerBlockType;
	var useBlockProps = blockEditor.useBlockProps;
	var TextControl = components.TextControl;
	var Button = components.Button;

	function withField( rows, index, field, value ) {
		var next = rows.slice();
		next[ index ] = Object.assign( {}, next[ index ] );
		next[ index ][ field ] = value;
		return next;
	}

	function renderPreview( a, rootProps ) {
		return el(
			'div',
			rootProps || { className: 'tvgf-data-table' },
			el( 'div', { className: 'tvgf-data-table-header' }, a.header || 'Table header…' ),
			( a.rows || [] ).map( function ( row, index ) {
				return el(
					'div',
					{ key: index, className: 'tvgf-data-row' },
					el( 'div', { className: 'tvgf-data-label' }, row.label ),
					el( 'div', { className: 'tvgf-data-value' }, row.value )
				);
			} )
		);
	}

	registerBlockType( 'tvgf/data-table', {
		edit: function ( props ) {
			var a = props.attributes;
			var rows = a.rows || [];
			var setAttributes = props.setAttributes;
			var blockProps = useBlockProps( { className: 'tvgf-data-table-edit' } );

			return el(
				'div',
				blockProps,
				el( 'p', { className: 'tvgf-block-label' }, 'Data Table — preview' ),
				renderPreview( a ),
				el( 'p', { className: 'tvgf-block-label' }, 'Edit' ),
				el( TextControl, {
					label: 'Header',
					value: a.header,
					onChange: function ( v ) {
						setAttributes( { header: v } );
					},
				} ),
				el( 'p', { className: 'tvgf-block-label' }, 'Rows' ),
				rows.map( function ( row, index ) {
					return el(
						'div',
						{ key: index, className: 'tvgf-data-table-row-edit' },
						el( TextControl, {
							label: 'Label',
							value: row.label || '',
							onChange: function ( v ) {
								setAttributes( { rows: withField( rows, index, 'label', v ) } );
							},
						} ),
						el( TextControl, {
							label: 'Value',
							value: row.value || '',
							onChange: function ( v ) {
								setAttributes( { rows: withField( rows, index, 'value', v ) } );
							},
						} ),
						el(
							Button,
							{
								isDestructive: true,
								variant: 'secondary',
								onClick: function () {
									var next = rows.slice();
									next.splice( index, 1 );
									setAttributes( { rows: next } );
								},
							},
							'Remove row'
						)
					);
				} ),
				el(
					Button,
					{
						variant: 'primary',
						onClick: function () {
							setAttributes( { rows: rows.concat( [ { label: '', value: '' } ] ) } );
						},
					},
					'+ Add row'
				)
			);
		},
		save: function ( props ) {
			var blockProps = blockEditor.useBlockProps.save( { className: 'tvgf-data-table' } );
			return renderPreview( props.attributes, blockProps );
		},
	} );
} )( window.wp.blocks, window.wp.element, window.wp.blockEditor, window.wp.components );
