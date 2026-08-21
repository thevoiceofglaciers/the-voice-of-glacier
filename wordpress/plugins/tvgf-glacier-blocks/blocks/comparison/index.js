( function ( blocks, element, blockEditor, components ) {
	var el = element.createElement;
	var registerBlockType = blocks.registerBlockType;
	var useBlockProps = blockEditor.useBlockProps;
	var TextControl = components.TextControl;
	var TextareaControl = components.TextareaControl;
	var Button = components.Button;

	function withField( items, index, field, value ) {
		var next = items.slice();
		next[ index ] = Object.assign( {}, next[ index ] );
		next[ index ][ field ] = value;
		return next;
	}

	registerBlockType( 'tvgf/comparison', {
		edit: function ( props ) {
			var columns = props.attributes.columns || [];
			var setAttributes = props.setAttributes;
			var blockProps = useBlockProps( { className: 'tvgf-comparison-edit' } );

			return el(
				'div',
				blockProps,
				el( 'p', {}, el( 'strong', {}, 'Comparison' ) ),
				columns.map( function ( col, index ) {
					return el(
						'div',
						{ key: index, className: 'tvgf-comparison-col-row' },
						el( TextControl, {
							label: 'Heading',
							value: col.heading || '',
							onChange: function ( v ) {
								setAttributes( { columns: withField( columns, index, 'heading', v ) } );
							},
						} ),
						el( TextareaControl, {
							label: 'Body',
							value: col.body || '',
							onChange: function ( v ) {
								setAttributes( { columns: withField( columns, index, 'body', v ) } );
							},
						} ),
						el(
							Button,
							{
								isDestructive: true,
								variant: 'secondary',
								onClick: function () {
									var next = columns.slice();
									next.splice( index, 1 );
									setAttributes( { columns: next } );
								},
							},
							'Remove'
						)
					);
				} ),
				el(
					Button,
					{
						variant: 'primary',
						onClick: function () {
							setAttributes( { columns: columns.concat( [ { heading: '', body: '' } ] ) } );
						},
					},
					'+ Add column'
				)
			);
		},
		save: function ( props ) {
			var columns = props.attributes.columns || [];
			var blockProps = blockEditor.useBlockProps.save( { className: 'tvgf-comparison' } );
			return el(
				'div',
				blockProps,
				columns.map( function ( col, index ) {
					return el(
						'div',
						{ key: index, className: 'tvgf-comparison-col' },
						el( 'div', { className: 'tvgf-comparison-heading' }, col.heading ),
						el( 'p', { className: 'tvgf-comparison-body' }, col.body )
					);
				} )
			);
		},
	} );
} )( window.wp.blocks, window.wp.element, window.wp.blockEditor, window.wp.components );
